const {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')

const cardUtil = require('./cardUtil.js')
const deckUtil = require('./deckUtil.js')
const res = require('./data.js')
const util = require('../lib/util.js')

const Player = require('./Player.js')
const { PlayerZone, Zone } = require('./Zone.js')


module.exports = {
  GameOverEvent,
  Magic,
  MagicFactory,
  factory: factoryFromLobby,
  res,
}

function Magic(serialized_data, viewerName) {
  Game.call(this, serialized_data, viewerName)

  this.cardLookup = null
  this.cardsById = {}
}

util.inherit(Game, Magic)

function MagicFactory(settings, viewerName) {
  const data = GameFactory(settings)
  return new Magic(data, viewerName)
}

function factoryFromLobby(lobby) {
  return GameFactory({
    game: 'Magic',
    name: lobby.name,
    expansions: lobby.options.expansions,
    players: lobby.users,
    seed: lobby.seed,
  })
}

Magic.prototype._mainProgram = function() {
  this.initialize()
  this.chooseDecks()
  this.mainLoop()
}

Magic.prototype._gameOver = function() {
  throw new Error('_gameOver is not used in Magic games')
}

////////////////////////////////////////////////////////////////////////////////
// Initialization

Magic.prototype.initialize = function() {
  this.mLog({ template: 'Initializing' })
  this.mLogIndent()

  this.state.nextLocalId = 1

  this.initializePlayers()
  this.initializeZones()
  this.initializeStartingPlayer()

  this.mLogOutdent()
  this.state.initializationComplete = true
  this._breakpoint('initialization-complete')
}

Magic.prototype.initializePlayers = function() {
  this.state.players = this.settings.players.map(p => new Player(this, p))
  util.array.shuffle(this.state.players, this.random)
  this.state.players.forEach((player, index) => {
    player.index = index
  })
  this.mLog({ template: 'Randomizing player seating' })
}

Magic.prototype.initializeZones = function() {
  this.state.zones = {}
  this.state.zones.players = {}
  this.state.zones.stack = new Zone(this, 'stack', 'public')

  for (const player of this.getPlayerAll()) {
    this.state.zones.players[player.name] = {
      // Private zones
      hand: new PlayerZone(this, player, 'hand', 'private'),
      library: new PlayerZone(this, player, 'library', 'hidden'),
      sideboard: new PlayerZone(this, player, 'sideboard', 'private'),

      // Public zones
      battlefield: new PlayerZone(this, player, 'battlefield', 'public'),
      command: new PlayerZone(this, player, 'command', 'public'),
      creatures: new PlayerZone(this, player, 'creatures', 'public'),
      graveyard: new PlayerZone(this, player, 'graveyard', 'public'),
      exile: new PlayerZone(this, player, 'exile', 'public'),
      land: new PlayerZone(this, player, 'land', 'public'),
    }
  }
}

Magic.prototype.initializeStartingPlayer = function() {
  const player = this.getPlayerByName(this.settings.startingPlayerName)
  if (player) {
    this.mLog({
      template: '{player} was selected to go first',
      args: { player }
    })
    this.state.currentPlayer = player
  }
  else {
    const randomPlayer = util.array.select(this.getPlayerAll(), this.random)
    this.mLog({
      template: 'Randomly selected {player} to go first',
      args: { player: randomPlayer }
    })
    this.state.currentPlayer = randomPlayer
  }
}


////////////////////////////////////////////////////////////////////////////////
// Game Phases

Magic.prototype.chooseDecks = function() {
  this.mLog({ template: 'Choosing starting decks' })
  this.mLogIndent()

  const requests = this
    .getPlayerAll()
    .map(player => ({
      actor: this.utilSerializeObject(player),
      title: 'Choose Deck',
      choices: '__UNSPECIFIED__',
    }))

  const responses = this.requestInputMany(requests)

  for (const response of responses) {
    const player = this.getPlayerByName(response.actor)
    this.setDeck(player, response.deckData)
  }

  this.mLogOutdent()
}

Magic.prototype.mainLoop = function() {
  while (true) {
    this.aChooseAction(this.getPlayerCurrent())
  }
}


////////////////////////////////////////////////////////////////////////////////
// Setters, getters, actions, etc.

Magic.prototype.aChooseAction = function(player) {
  const actions = this.requestInputSingle({
    actor: player.name,
    title: 'Do Something',
    choices: '__UNSPECIFIED__',
  })

  for (const action of actions) {
    switch (action.name) {
      case 'adjust counter'      : return player.incrementCounter(action.counter, action.amount)
      case 'draw'                : return this.aDraw(player)
      case 'draw 7'              : return this.aDrawSeven(player)
      case 'move card'           : return this.aMoveCard(player, action.cardId, action.destId, action.destIndex)
      case 'mulligan'            : return this.aMulligan(player)
      case 'reveal next'         : return this.aRevealNext(player, action.zoneId)
      case 'view next'           : return this.aViewNext(player, action.zoneId)
      case 'view top k'          : return this.aViewTop(player, action.zoneId, action.count)

      default:
        throw new Error(`Unknown action: ${action.name}`)
    }
  }
}

Magic.prototype.aDraw = function(player, opts={}) {
  const libraryCards = this.getCardsByZone(player, 'library')

  if (libraryCards.length === 0) {
    this.mLog({
      template: '{player} tries to draw a card, but their library is empty',
      args: { player }
    })
    return
  }

  const card = libraryCards[0]
  this.mMoveCardTo(card, this.getZoneByPlayer(player, 'hand'))

  if (!this.silent) {
    this.mLog({
      template: '{player} draws {card}',
      args: { player, card }
    })
  }
}

Magic.prototype.aDrawSeven = function(player, opts={}) {
  if (!opts.silent) {
    this.mLog({
      template: '{player} draws 7 cards',
      args: { player }
    })
  }
  for (let i = 0; i < 7; i++) {
    this.aDraw(player, { silent: true })
  }
}

Magic.prototype.aMoveCard = function(player, cardId, destId, destIndex) {
  const card = this.getCardById(cardId)
  const dest = this.getZoneById(destId)
  this.mMoveCardTo(card, dest, { index: destIndex })
  this.mLog({
    template: '{player} moves {card} to {zone}',
    args: { player, card, zone: dest }
  })
}

Magic.prototype.aMulligan = function(player) {
  this.mLog({
    template: '{player} takes a mulligan',
    args: { player }
  })

  const library = this.getZoneByPlayer(player, 'library')
  for (const card of game.getCardsByZone(player, 'hand')) {
    this.mMoveCardTo(card, library)
  }

  library.shuffle({ silent: true })

  this.aDrawSeven(player, { silent: true })
}

Magic.prototype.aRevealNext = function(player, zoneId) {
  const zone = this.getZoneById(zoneId)
  const cards = zone.cards()
  const nextIndex = cards.findIndex(card => card.visibility.length !== this.getPlayerAll().length)

  if (nextIndex === -1) {
    this.mLog({
      template: 'No more cards to reveal in {zone}',
      args: { zone },
    })
    return
  }

  const card = cards[nextIndex]
  card.visibility = this.getPlayerAll()
  this.mLog({
    template: `{player} reveals the next card in {zone} (top+${nextIndex})`,
    args: { player, zone }
  })
}

Magic.prototype.aViewNext = function(player, zoneId) {
  const zone = this.getZoneById(zoneId)
  const cards = zone.cards()
  const nextIndex = cards.findIndex(card => !card.visibility.includes(player))

  if (nextIndex === -1) {
    this.mLog({
      template: 'No more cards for {player} to view in {zone}',
      args: { player, zone },
    })
    return
  }

  const card = cards[nextIndex]
  card.visibility.push(player)
  this.mLog({
    template: `{player} views the next card in {zone} (top+${nextIndex})`,
    args: { player, zone }
  })
}

Magic.prototype.aViewTop = function(player, zoneId, count) {
  const zone = this.getZoneById(zoneId)
  const cards = zone.cards()
  count = Math.min(count, cards.length)

  for (let i = 0; i < count; i++) {
    util.array.pushUnique(cards[i].visibility, player)
  }

  this.mLog({
    template: `{player} views the top ${count} cards of {zone}`,
    args: { player, zone },
  })
}

Magic.prototype.getCardById = function(id) {
  return this.cardsById[id]
}

Magic.prototype.getNextLocalId = function() {
  this.state.nextLocalId += 1
  return this.state.nextLocalId
}

Magic.prototype.mAdjustCardVisibility = function(card) {
  const zone = this.getZoneByCard(card)

  if (zone.kind === 'public') {
    card.visibility = this.getPlayerAll()
  }
  else if (zone.kind === 'private' && zone.owner) {
    util.array.pushUnique(card.visibility, zone.owner)
  }
  else if (zone.kind === 'hidden') {
    // do nothing
  }
  else {
    throw new Error(`Unhandled zone kind '${zone.kind}' for zone '${zone.id}'`)
  }
}

Magic.prototype.mMoveByIndices = function(source, sourceIndex, target, targetIndex) {
  util.assert(sourceIndex >= 0 && sourceIndex <= source.cards().length - 1, `Invalid source index ${sourceIndex}`)

  const sourceCards = source._cards
  const targetCards = target._cards
  const card = sourceCards[sourceIndex]
  sourceCards.splice(sourceIndex, 1)
  targetCards.splice(targetIndex, 0, card)
  card.zone = target.id
  this.mAdjustCardVisibility(card)
  return card
}

Magic.prototype.mMoveCardTo = function(card, zone, opts={}) {
  if (opts.verbose) {
    this.mLog({
      template: 'Moving {card} to {zone}',
      args: { card, zone }
    })
  }
  const source = this.getZoneByCard(card)
  const index = source.cards().indexOf(card)
  const destIndex = opts.index ? opts.index : zone.cards().length
  this.mMoveByIndices(source, index, zone, destIndex)
}

Magic.prototype.setDeck = function(player, data) {
  this.mLog({
    template: '{player} has selected a deck',
    args: { player },
  })

  player.deck = deckUtil.deserialize(util.deepcopy(data))
  cardUtil.lookup.insertCardData(player.deck.cardlist, this.cardLookup)
  for (const card of player.deck.cardlist) {
    card.id = this.getNextLocalId()
    this.cardsById[card.id] = card
  }

  const zones = util.array.collect(player.deck.cardlist, card => card.zone)

  if (!zones.main) {
    throw new Error('No cards in maindeck for deck: ' + player.deck.name)
  }

  const library = this.getZoneByPlayer(player, 'library')
  for (const card of zones.main) {
    library.addCard(card)
    card.visibility = []
  }
  library.shuffle()

  if (zones.side) {
    const sideboard = this.getZoneByPlayer(player, 'sideboard')
    for (const card of zones.side) {
      sideboard.addCard(card)
      card.visibility = [player]
    }
  }

  if (zones.command) {
    const command = this.getZoneByPlayer(player, 'command')
    for (const card of zones.command) {
      command.addCard(card)
      card.visibility = [player]
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Utility functions

Magic.prototype.utilSerializeObject = function(obj) {
  if (typeof obj === 'object') {
    util.assert(obj.id !== undefined, 'Object has no id. Cannot serialize.')
    return obj.id
  }
  else if (typeof obj === 'string') {
    return obj
  }
  else {
    throw new Error(`Cannot serialize element of type ${typeof obj}`)
  }
}

Magic.prototype._enrichLogArgs = function(msg) {
  for (const key of Object.keys(msg.args)) {
    if (key === 'players') {
      const players = msg.args[key]
      msg.args[key] = {
        value: players.map(p => p.name || p).join(', '),
        classes: ['player-names'],
      }
    }
    else if (key.startsWith('player')) {
      const player = msg.args[key]
      msg.args[key] = {
        value: player.name || player,
        classes: ['player-name']
      }
    }
    else if (key.startsWith('card')) {
      const card = msg.args[key]
      msg.args[key] = {
        value: card.id,
        classes: ['card-id'],
      }
    }
    else if (key.startsWith('zone')) {
      const zone = msg.args[key]
      msg.args[key] = {
        value: zone.name,
        classes: ['zone-name']
      }
    }
    // Convert string args to a dict
    else if (typeof msg.args[key] !== 'object') {
      msg.args[key] = {
        value: msg.args[key],
      }
    }
  }
}
