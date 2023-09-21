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
  draft: {
    cube: require('./draft/cube_draft.js'),
  },
  util: {
    card: cardUtil,
    deck: deckUtil,
  },
}

function Magic(serialized_data, viewerName) {
  Game.call(this, serialized_data, viewerName)

  this.cardLookupFunc = null
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
    format: lobby.options.format,
    linkedDraftId: lobby.options.linkedDraftId,
    players: lobby.users,
    seed: lobby.seed,
  })
}

Magic.prototype._mainProgram = function() {
  this.initialize()
  this.chooseDecks()

  this.state.phase = 'start turn'
  this.mLogSetIndent(0)
  this.mLog({
    template: "{player}'s turn",
    args: {
      player: this.getPlayerCurrent(),
      classes: ['start-turn'],
    }
  })
  this.mLogIndent()
  this.mLog({
    template: '{player} gets priority',
    args: { player: this.getPlayerCurrent() },
    classes: ['pass-priority'],
  })

  this.mainLoop()
}

Magic.prototype._gameOver = function(event) {
  this.mLogSetIndent(0)
  this.mLog({
    template: '{player} wins due to {reason}',
    args: {
      player: event.data.player,
      reason: event.data.reason,
    }
  })
  return event
}

Magic.prototype._cardMovedCallback = function({ card, sourceZone, targetZone }) {
  this.mAdjustCardVisibility(card)
  this.mMaybeClearAnnotations(card)
  this.mMaybeClearCounters(card)
  this.mMaybeRemoveTokens(card)

  const sourceKind = sourceZone.id.split('.').slice(-1)[0]
  const targetKind = targetZone.id.split('.').slice(-1)[0]

  // Card was moved to stack.
  if (targetKind === 'stack') {
    this.mLogIndent()
  }

  // Card was removed from stack.
  if (sourceKind === 'stack') {
    this.mLog({
      template: '{card} resolves',
      args: { card },
      classes: ['stack-pop'],
    })
    this.mLogOutdent()
  }

  // Card moved to a non-tap zone
  if (card.tapped) {
    if (!['creatures', 'battlefield', 'land', 'attacking', 'blocking'].includes(targetKind)) {
      this.mUntap(card)
    }
  }

  // Move card to the attacking zone, which usually taps them
  if (targetKind === 'attacking') {
    this.mTap(card)
  }
}


////////////////////////////////////////////////////////////////////////////////
// Initialization

Magic.prototype.initialize = function() {
  this.mLog({ template: 'Initializing' })
  this.mLogIndent()

  this.state.nextLocalId = 1
  this.state.turnPlayer = null

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
      stack: new PlayerZone(this, player, 'stack', 'public'),

      attacking: new PlayerZone(this, player, 'attacking', 'public'),
      blocking: new PlayerZone(this, player, 'blocking', 'public'),
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
  this.state.turnPlayer = this.state.currentPlayer
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

  this.state.decksSelected = true

  this._breakpoint('decks-selected')
  this.mLogOutdent()
}

Magic.prototype.mainLoop = function() {
  while (true) {
    this.aChooseAction(this.getPlayerCurrent())
  }
}


////////////////////////////////////////////////////////////////////////////////
// Setters, getters, actions, etc.

Magic.prototype.aActiveFace = function(player, cardId, face) {
  player = player || this.getPlayerCurrent()
  const card = this.getCardById(cardId)
  const prevFace = card.activeFace
  card.activeFace = face
  this.mLog({
    template: `{player} flips ${prevFace} to ${card.activeFace}`,
    args: { player },
  })
}

Magic.prototype.aAddCounter = function(player, cardId, name, opts={}) {
  player = player || this.getPlayerCurrent()
  const card = this.getCardById(cardId)

  if (!card.counters[name]) {
    card.counters[name] = 0

    if (!opts.noIncrement) {
      this.aAdjustCardCounter(player, cardId, name, 1)
    }
  }
}

Magic.prototype.aAddCounterPlayer = function(player, targetName, counterName) {
  const target = this.getPlayerByName(targetName)

  if (counterName in target.counters) {
    throw new Error(`Counter already exists: ${counterName}`)
  }

  target.counters[counterName] = 0

  this.mLog({
    template: 'Counter {name} added to {player}',
    args: { player: target, name: counterName },
  })
}

Magic.prototype.aAdjustCardCounter = function(player, cardId, name, amount) {
  player = player || this.getPlayerCurrent()
  const card = this.getCardById(cardId)
  card.counters[name] += amount

  let msg
  if (amount === 1) {
    msg = 'added'
  }
  else if (amount === -1) {
    msg = 'removed'
  }
  else {
    msg = `adjusted by ${amount}`
  }

  this.mLog({
    template: `{card} ${name} counter ${msg}`,
    args: { card }
  })
}

Magic.prototype.aAnnotate = function(player, cardId, annotation) {
  player = player || this.getPlayerCurrent()
  const card = this.getCardById(cardId)
  card.annotation = annotation
  this.mLog({
    template: '{player} sets annotation on {card} to {annotation}',
    args: { player, card, annotation },
  })
}

Magic.prototype.aAnnotateEOT = function(player, cardId, annotation) {
  player = player || this.getPlayerCurrent()
  const card = this.getCardById(cardId)
  card.annotationEOT = annotation
  this.mLog({
    template: '{player} sets EOT annotation on {card} to {annotation}',
    args: { player, card, annotation },
  })
}

Magic.prototype.aCascade = function(player, x) {
  const cards = this.getCardsByZone(player, 'library')

  this.mLog({
    template: '{player} cascades for {count}',
    args: { player, count: x },
  })
  this.mLogIndent()

  this.mLog({ template: 'revealing cards' })
  this.mLogIndent()

  let i
  for (i = 0; i < cards.length; i++) {
    this.aReveal(player, cards[i])

    if (cards[i].data.cmc < x && !cardUtil.isLand(cards[i])) {
      break
    }
  }

  this.mLogOutdent()

  if (i < cards.length) {
    const card = cards[i]
    this.mLog({
      template: '{player} cascades into {card}',
      args: { player, card }
    })
    this.mLogIndent()

    this.mMoveCardTo(card, this.getZoneByPlayer(player, 'stack', { index: 0 }))
    const library = this.getZoneByPlayer(player, 'library')
    for (let j = 0; j < i; j++) {
      this.mMoveCardTo(cards[j], library, { verbose: true })
    }
    library.shuffleBottom(i)

    this.mLogOutdent()
  }

  else {
    this.mLog({
      template: '{player} fails to find a valid cascade target',
      args: { player }
    })
  }

  this.mLogOutdent()
}

Magic.prototype.aConcede = function(player) {
  this.mLog({
    template: '{player} concedes',
    args: { player },
    classes: ['player-concedes']
  })
  player.eliminated = true

  // If only one team remains, then the game is over.
  const teams = util.array.collect(this.getPlayerAll(), p => p.team)
  const remaining = Object.values(teams).filter(players => players.some(p => !p.eliminated))

  if (remaining.length === 1) {
    const winningTeam = remaining[0]
    if (winningTeam.length === 1) {
      throw new GameOverEvent({
        player: winningTeam[0].name,
        reason: 'I am the best, you are the rest!',
      })
    }
    else {
      throw new GameOverEvent({
        player: `team ${winningTeam[0].team}`,
        reason: 'All your base are belong to us.',
      })
    }
  }
}

Magic.prototype.aChooseAction = function(player) {
  const actions = this.requestInputSingle({
    actor: player.name,
    title: 'Do Something',
    choices: '__UNSPECIFIED__',
  })

  for (const action of actions) {
    const actor = action.playerName ? this.getPlayerByName(action.playerName) : player

    switch (action.name) {
      case 'active face'         : return this.aActiveFace(actor, action.cardId, action.face)
      case 'add counter'         : return this.aAddCounter(actor, action.cardId, action.key)
      case 'add counter player'  : return this.aAddCounterPlayer(actor, action.playerName, action.key)
      case 'adjust c-counter'    : return this.aAdjustCardCounter(actor, action.cardId, action.key, action.count)
      case 'adjust counter'      : return actor.incrementCounter(action.counter, action.amount)
      case 'annotate'            : return this.aAnnotate(actor, action.cardId, action.annotation)
      case 'annotate eot'        : return this.aAnnotateEOT(actor, action.cardId, action.annotation)
      case 'cascade'             : return this.aCascade(actor, action.x)
      case 'create token'        : return this.aCreateToken(actor, action.data)
      case 'concede'             : return this.aConcede(actor)
      case 'draw'                : return this.aDraw(actor)
      case 'draw 7'              : return this.aDrawSeven(actor)
      case 'draw game'           : return this.aDrawGame(actor)
      case 'hide all'            : return this.aHideAll(actor, action.zoneId)
      case 'import card'         : return this.aImportCard(actor, action.data)
      case 'morph'               : return this.aMorph(actor, action.cardId)
      case 'move all'            : return this.aMoveAll(actor, action.sourceId, action.targetId)
      case 'move card'           : return this.aMoveCard(actor, action.cardId, action.destId, action.destIndex)
      case 'move revealed'       : return this.aMoveRevealed(actor, action.sourceId, action.targetId)
      case 'mulligan'            : return this.aMulligan(actor)
      case 'notap clear'         : return this.aSetNoUntap(actor, action.cardId, false)
      case 'notap set'           : return this.aSetNoUntap(actor, action.cardId, true)
      case 'pass priority'       : return this.aPassPriority(actor, action.target)
      case 'reveal'              : return this.aReveal(actor, action.cardId)
      case 'reveal all'          : return this.aRevealAll(actor, action.zoneId)
      case 'reveal next'         : return this.aRevealNext(actor, action.zoneId)
      case 'roll die'            : return this.aRollDie(actor, action.faces)
      case 'select phase'        : return this.aSelectPhase(actor, action.phase)
      case 'shuffle'             : return this.aShuffle(actor, action.zoneId)
      case 'shuffle bottom'      : return this.aShuffleBottom(actor, action.zoneId, action.count)
      case 'stack effect'        : return this.aStackEffect(actor, action.cardId)
      case 'tap'                 : return this.aTap(actor, action.cardId)
      case 'trigger'             : return this.aTrigger(actor, action.cardId)
      case 'unmorph'             : return this.aUnmorph(actor, action.cardId)
      case 'untap'               : return this.aUntap(actor, action.cardId)
      case 'view all'            : return this.aViewAll(actor, action.zoneId)
      case 'view next'           : return this.aViewNext(actor, action.zoneId)
      case 'view top k'          : return this.aViewTop(actor, action.zoneId, action.count)

      // Deprecated
      case 'twiddle'             : return this.aTwiddle(actor, action.cardId)

      default:
        throw new Error(`Unknown action: ${action.name}`)
    }
  }
}

Magic.prototype.aCreateToken = function(player, data, opts={}) {
  const zone = this.getZoneById(data.zoneId)
  const owner = this.getPlayerByZone(zone)

  const created = []

  for (let i = 0; i < data.count; i++) {
    // Create fake card data
    const card = {
      name: data.name,
      set: '',
      collectorNumber: '',
      data: cardUtil.blank(),
    }

    card.data.name = card.name
    card.data.type_line = 'Token'

    card.data.card_faces[0].type_line = 'Token'
    card.data.card_faces[0].name = card.name
    card.data.card_faces[0].image_uri = 'https://i.pinimg.com/736x/6e/fe/d4/6efed4b65fb7666de4b615d8b1195258.jpg'

    // Insert card into game
    this.mInitializeCard(card, owner)
    card.annotation = data.annotation
    card.token = true

    if (data.morph) {
      card.morph = true
      card.visibility = [player]
    }
    else {
      card.visibility = this.getPlayerAll()
    }

    zone.addCard(card)
    created.push(card)


    if (zone.id.endsWith('.stack')) {
      this.mLogStackPush(player, card)
      this.mLogIndent()
    }
    else if (!opts.silent) {
      this.mLog({
        template: "{card} imported to {zone}",
        args: { player: owner, card, zone },
      })
    }
  }

  return created
}

Magic.prototype.aDraw = function(player, opts={}) {
  player = player || this.getPlayerCurrent()
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

  if (!opts.silent) {
    this.mLog({
      template: '{player} draws {card}',
      args: { player, card }
    })
  }
}

Magic.prototype.aDrawGame = function(player) {
  this.mLog({
    template: '{player} declares a draw',
    args: { player },
    classes: ['draw-game']
  })
  throw new GameOverEvent({
    player: 'nobody',
    reason: 'Draw Game',
  })
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

Magic.prototype.aHideAll = function(player, zoneId) {
  const zone = this.getZoneById(zoneId)
  zone.cards().forEach(card => this.mHide(card))

  this.mLog({
    template: `{player} hides {zone}`,
    args: { player, zone }
  })
}

Magic.prototype.aImportCard = function(player, data) {
  for (let i = 0; i < data.count; i++) {
    const card = {
      name: data.card.name,
      set: data.card.set,
      collector_number: data.card.collector_number,
      custom_id: data.card.custom_id,
      data: data.card,
    }

    this.mInitializeCard(card, player)
    card.annotation = data.annotation
    card.token = data.isToken
    card.visibility = this.getPlayerAll()

    const zone = this.getZoneById(data.zoneId)
    const owner = this.getPlayerByZone(zone)
    zone.addCard(card)

    // Card was moved to stack.
    if (zone.id.endsWith('.stack')) {
      this.mLogStackPush(player, card)
      this.mLogIndent()
    }
    else {
      this.mLog({
        template: "{card} imported to {zone}",
        args: { player: owner, card, zone },
      })
    }
  }
}

Magic.prototype.aMorph = function(player, cardId) {
  player = player || this.getPlayerCurrent()
  const zone = this.getZoneByPlayer(player, 'stack')
  const card = this.getCardById(cardId)
  card.morph = true
  this.aMoveCard(player, cardId, zone.id, 0)
}

Magic.prototype.aMoveAll = function(player, sourceId, targetId) {
  const source = this.getZoneById(sourceId)
  const toMove = source.cards()
  for (const card of toMove) {
    this.aMoveCard(player, card.id, targetId)
  }
}

Magic.prototype.aMoveCard = function(player, cardId, destId, destIndex) {
  player = player || this.getPlayerCurrent()

  const card = this.getCardById(cardId)
  const startingZone = this.getZoneByCard(card)
  const dest = this.getZoneById(destId)

  const enforceOrdering = dest.name === 'graveyard'
  if (enforceOrdering) {
    destIndex = 0
  }

  this.mMoveCardTo(card, dest, { index: destIndex })

  if (dest.id.endsWith('stack')) {
    this.mLogStackPush(player, card)
  }

  else if (startingZone.id.endsWith('stack')) {
    // Say nothing. This is handled in the move card functionality.
  }

  else if (startingZone !== dest || dest.id.endsWith('library')) {
    this.mLog({
      template: '{player} moves {card} from {zone1} to {zone2}',
      args: {
        player,
        card,
        zone1: startingZone,
        zone2: dest,
      }
    })
  }


  // If the card moved from a non-battlefield zone to a battlefield zone,
  // add counters to it if appropriate.
  if (card.zone) {  // Do this check because tokens actually disappear when they move sometimes.

    const endingZone = this.getZoneByCard(card)
    if (!this.checkIsBattlefieldZone(startingZone) && this.checkIsBattlefieldZone(endingZone)) {

      // Loyalty counters are a special case
      if (card.data.card_faces[0].loyalty) {
        this.aAddCounter(player, cardId, 'loyalty', { noIncrement: true })
        this.aAdjustCardCounter(player, cardId, 'loyalty', parseInt(card.data.card_faces[0].loyalty))
      }

      // Defense counters are a special case
      else if (card.data.card_faces[0].defense) {
        this.aAddCounter(player, cardId, 'defense', { noIncrement: true })
        this.aAdjustCardCounter(player, cardId, 'defense', parseInt(card.data.card_faces[0].defense))
      }

      // All other counters, infer their existence on the card and add an empty counter
      // field for them.
      else if (card.data.card_faces[0].oracle_text) {
        const exceptions = ['a', 'any', 'all', 'and', 'another', 'be', 'crank!', 'each', 'five', 'get', 'goes', 'had', 'have', 'instead', 'is', 'may', 'no', 'of', 'that', 'those', 'three', 'was', 'with', 'would', 'x', ]
        const re = /([^ ]+) counter/
        const text = card.data.card_faces[0].oracle_text
        const match = re.exec(text)
        if (match) {
          const kind = match[1].toLowerCase()
          if (exceptions.includes(kind)) {
            // do nothing
          }
          else if (kind.startsWith('(')) {
            // do nothing
          }
          else if (kind.endsWith(',')) {
            // do nothing
          }
          else {
            this.aAddCounter(player, cardId, kind, { noIncrement: true })
          }
        }
      }
    }
  }
}

Magic.prototype.aMoveRevealed = function(player, sourceId, targetId) {
  const source = this.getZoneById(sourceId)
  const numPlayers = this.getPlayerAll().length

  const toMove = util
    .array
    .takeWhile(source.cards(), card => card.visibility.length === numPlayers)

  for (const card of toMove) {
    this.aMoveCard(player, card.id, targetId)
  }
}

Magic.prototype.aMulligan = function(player) {
  this.mLog({
    template: '{player} takes a mulligan',
    args: { player }
  })
  this.mLogIndent()

  const library = this.getZoneByPlayer(player, 'library')
  for (const card of this.getCardsByZone(player, 'hand')) {
    this.mMoveCardTo(card, library)
  }

  library.shuffle()

  this.aDrawSeven(player)
  this.mLogOutdent()
}

Magic.prototype.aPassPriority = function(actor, targetName) {
  const player = targetName ? this.getPlayerByName(targetName) : this.getPlayerNext()
  this.state.currentPlayer = player

  const indent = this.getLogIndent()
  this.mLogSetIndent(1)
  this.mLog({
    template: '{player} gets priority',
    args: { player },
    classes: ['pass-priority'],
  })
  this.mLogSetIndent(indent)
}

Magic.prototype.aReveal = function(player, cardId) {
  player = player || this.getPlayerCurrent()
  const card = this.getCardById(cardId)

  this.mReveal(card)
  const zone = this.getZoneByCard(card)
  this.mLog({
    template: '{player} reveals {card} from {zone}',
    args: { player, card, zone },
  })
}

Magic.prototype.aRevealAll = function(player, zoneId) {
  const zone = this.getZoneById(zoneId)
  zone.cards().forEach(card => this.mReveal(card))

  this.mLog({
    template: `{player} reveals {zone}`,
    args: { player, zone }
  })
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
  this.mReveal(card)
  this.mLog({
    template: `{player} reveals the next card in {zone} (top+${nextIndex})`,
    args: { player, zone }
  })
}

Magic.prototype.aRollDie = function(player, faces) {
  const result = Math.floor(this.random() * faces) + 1

  let extra = ''
  if (faces === 2) {
    if (result === 1) {
      extra = ' (heads)'
    }
    else {
      extra = ' (tails)'
    }
  }

  this.mLog({
    template: `{player} rolled ${result} on a d${faces}${extra}`,
    args: { player },
    classes: ['die-roll'],
  })
}

Magic.prototype.aSelectPhase = function(player, phase) {
  this.mClearStack()
  this.state.phase = phase

  if (phase === 'start turn') {
    this.mLogSetIndent(0)
    this.mLog({
      template: "{player}'s turn",
      args: {
        player: this.getPlayerCurrent(),
        classes: ['start-turn'],
      }
    })
    this.mLogIndent()
    this.state.turnPlayer = this.getPlayerCurrent()
  }
  else {
    this.mLogSetIndent(1)
    this.mLog({
      template: `phase: ${phase}`,
      classes: ['set-phase'],
    })
    this.mLogIndent()
  }


  // Special handling for some phases

  if (phase === 'untap') {
    const cards = [
      ...this.getCardsByZone(player, 'creatures'),
      ...this.getCardsByZone(player, 'battlefield'),
      ...this.getCardsByZone(player, 'land'),
    ].flat()
     .filter(card => !card.noUntap)
     .forEach(card => this.mUntap(card))
  }
  else if (phase === 'draw') {
    this.aDraw()
  }
  else if (phase === 'end') {
    this.mLogIndent()
    for (const card of this.getCardAll()) {
      if (card.annotationEOT) {
        this.mLog({
          template: `{card} status ${card.annotationEOT} clears`,
          args: { card }
        })
        card.annotationEOT = ''
      }
    }
    this.mLogOutdent()
  }

  // Move all cards out of the attackers and blockers zones
  if (!this.utilCombatPhases().includes(phase)) {
    for (const player of this.getPlayerAll()) {
      const creaturesZone = this.getZoneByPlayer(player, 'creatures')

      for (const zoneName of ['attacking', 'blocking']) {
        const cards = this.getCardsByZone(player, zoneName)
        for (const card of cards) {
          this.mMoveCardTo(card, creaturesZone)
        }
      }
    }
  }
}

Magic.prototype.aSetNoUntap = function(player, cardId, value) {
  const card = this.getCardById(cardId)
  card.noUntap = value

  if (value) {
    this.mLog({
      template: '{card} will no longer auto-untap',
      args: { card },
    })
  }
  else {
    this.mLog({
      template: '{card} will untap as normal',
      args: { card },
    })
  }
}

Magic.prototype.aShuffle = function(player, zoneId) {
  const zone = this.getZoneById(zoneId)
  zone.shuffle()
}

Magic.prototype.aShuffleBottom = function(player, zoneId, count) {
  const zone = this.getZoneById(zoneId)
  zone.shuffleBottom(count)
}

Magic.prototype.aStackEffect = function(player, cardId) {
  const card = this.getCardById(cardId)
  const owner = this.getPlayerByOwner(card)
  const stack = this.getZoneByPlayer(owner, 'stack')

  const data = {
    zoneId: stack.id,
    count: 1,
    name: 'effect: ' + card.name,
  }

  const token = this.aCreateToken(owner, data, { silent: true })[0]
}

Magic.prototype.aTap = function(player, cardId) {
  const card = this.getCardById(cardId)
  this.mTap(card)
  this.mLog({
    template: 'tap: {card}',
    args: { card }
  })
}

Magic.prototype.aTrigger = function(player, cardId) {
  const card = this.getCardById(cardId)
  const token = this.aCreateEffect(player, card)
}

Magic.prototype.aTwiddle = function(player, cardId) {
  const card = this.getCardById(cardId)

  if (card.tapped) {
    card.tapped = false
    this.mLog({
      template: 'untap: {card}',
      args: { card }
    })
  }
  else {
    card.tapped = true
    this.mLog({
      template: 'tap: {card}',
      args: { card }
    })
  }
}

Magic.prototype.aUnmorph = function(player, cardId) {
  player = player || this.getPlayerCurrent()
  const card = this.getCardById(cardId)
  card.morph = false
  this.mReveal(card)
  this.mLog({
    template: '{player} unmorphs {card}',
    args: { player, card },
  })
}

Magic.prototype.aUntap = function(player, cardId) {
  const card = this.getCardById(cardId)
  card.tapped = false
  this.mLog({
    template: 'untap: {card}',
    args: { card }
  })
}

Magic.prototype.aViewAll = function(player, zoneId) {
  const zone = this.getZoneById(zoneId)
  zone.sortCardsByName()
  zone.cards().forEach(card => util.array.pushUnique(card.visibility, player))

  this.mLog({
    template: `{player} views {zone}`,
    args: { player, zone },
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

Magic.prototype.checkIsBattlefieldZone = function(zone) {
  return (
    zone.id.endsWith('battlefield')
    || zone.id.endsWith('creatures')
    || zone.id.endsWith('land')
  )
}

Magic.prototype.getCardById = function(id) {
  if (typeof id === 'object') {
    return id
  }
  else {
    return this.cardsById[id]
  }
}

Magic.prototype.getCardAll = function() {
  return Object.values(this.cardsById)
}

Magic.prototype.getDecksSelected = function() {
  return this.state.decksSelected
}

Magic.prototype.getNextLocalId = function() {
  this.state.nextLocalId += 1
  return this.state.nextLocalId
}

Magic.prototype.getPhase = function() {
  return this.state.phase
}

Magic.prototype.getPlayerByCardController = function(card) {
  const zone = this.getZoneByCard(card)
  return this.getPlayerByZone(zone)
}

Magic.prototype.getPlayerTurn = function() {
  return this.state.turnPlayer
}

Magic.prototype.getZoneIndexByCard = function(card) {
  const zoneCards = this.getZoneByCard(card).cards()
  return zoneCards.indexOf(card)
}

Magic.prototype.mAdjustCardVisibility = function(card) {
  const zone = this.getZoneByCard(card)

  if (card.morph) {
    card.visibility = [this.getPlayerByCardController(card)]
  }
  else if (zone.kind === 'public') {
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

Magic.prototype.mClearStack = function() {

  const toClear = []

  for (const player of this.getPlayerAll()) {
    const cards = this.getCardsByZone(player, 'stack')
    for (const card of cards) {
      toClear.push(card)
    }
  }

  if (toClear.length > 0) {
    this.mLog({ template: 'clearing stack' })
    this.mLogIndent()

    for (const card of toClear) {
      const owner = this.getPlayerByOwner(card)
      const graveyard = this.getZoneByPlayer(owner, 'graveyard')
      this.mMoveCardTo(card, graveyard, { verbose: true })
    }
    this.mLogOutdent()
  }
}

Magic.prototype.mHide = function(card) {
  const zone = this.getZoneByCard(card)
  if (zone.kind === 'public') {
    throw new Error(`Can't hide cards in public zone ${zone.id}`)
  }
  else if (zone.kind === 'private') {
    card.visibility = [zone.owner]
  }
  else if (zone.kind === 'hidden') {
    card.visibility = []
  }
  else {
    throw new Error(`Unhandled zone type ${zone.kind}`)
  }
}

Magic.prototype.mInitializeCard = function(card, owner) {
  card.activeFace = card.data.card_faces[0].name
  card.annotation = ''
  card.annotationEOT = ''
  card.counters = {
    '+1/+1': 0,
  }
  card.id = this.getNextLocalId()
  card.morph = false
  card.noUntap = false
  card.owner = owner
  card.tapped = false
  card.token = false
  card.visibility = []

  this.cardsById[card.id] = card
}

Magic.prototype.mLogStackPush = function(player, card) {
  this.mLog({
    template: '{player} puts {card} on the stack',
    args: { player, card },
    classes: ['stack-push'],
  })
}

Magic.prototype.mMaybeClearAnnotations = function(card) {
  const validZones = ['creatures', 'battlefield', 'land', 'attacking', 'blocking']

  if (!validZones.some(id => card.zone.endsWith(id))) {
    card.annotation = ''
    card.annotationEOT = ''
  }
}

Magic.prototype.mMaybeClearCounters = function(card) {
  const validZones = ['creatures', 'battlefield', 'land', 'attacking', 'blocking']

  if (!validZones.some(id => card.zone.endsWith(id))) {
    Object
      .keys(card.counters)
      .forEach(c => card.counters[c] = 0)
  }
}

Magic.prototype.mMaybeRemoveTokens = function(card) {
  const validZones = ['creatures', 'battlefield', 'land', 'stack', 'attacking', 'blocking']

  if (card.token && !validZones.some(id => card.zone.endsWith(id))) {
    this.mLogIndent()
    this.mLog({
      template: '{card} token ceases to exist',
      args: { card }
    })
    this.mLogOutdent()

    const zone = this.getZoneByCard(card)
    zone.removeCard(card)
    card.owner = undefined
  }
}

Magic.prototype.mReveal = function(card) {
  card.visibility = this.getPlayerAll()
}

Magic.prototype.mTap = function(card) {
  card.tapped = true
}

Magic.prototype.mUntap = function(card) {
  card.tapped = false
}

Magic.prototype.setDeck = function(player, data) {
  this.mLog({
    template: '{player} has selected a deck',
    args: { player },
  })

  player.deck = deckUtil.deserialize(util.deepcopy(data))
  cardUtil.lookup.insertCardData(player.deck.cardlist, this.cardLookupFunc)
  for (const card of player.deck.cardlist) {
    this.mInitializeCard(card, player)
  }

  const zones = util.array.collect(player.deck.cardlist, card => card.zone)

  if (!zones.main) {
    throw new Error('No cards in maindeck for deck: ' + player.deck.name)
  }

  const library = this.getZoneByPlayer(player, 'library')
  for (const card of zones.main) {
    library.addCard(card)
  }
  library.shuffle()

  if (zones.side) {
    const sideboard = this.getZoneByPlayer(player, 'sideboard')
    for (const card of zones.side) {
      sideboard.addCard(card)
      card.visibility.push(player)
    }
  }

  if (zones.command) {
    const command = this.getZoneByPlayer(player, 'command')
    for (const card of zones.command) {
      command.addCard(card)
      card.visibility.push(player)
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Utility functions

Magic.prototype.utilCombatPhases = function() {
  return ['c begin', 'attackers', 'blockers', 'damage', 'c end']
}

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
      const isHidden = !card.visibility.find(p => p.name === this.viewerName)

      if (isHidden) {
        msg.args[key] = {
          value: card.morph ? 'a morph' : 'a card',
          classes: ['card-hidden'],
        }
      }
      else {
        msg.args[key] = {
          value: card.name,
          cardId: card.id,  // Important in some UI situations.
          classes: ['card-name'],
        }
      }
    }
    else if (key.startsWith('zone')) {
      const zone = msg.args[key]
      const owner = this.getPlayerByZone(zone)

      const value = owner ? `${owner.name}'s ${zone.name}` : zone.name

      msg.args[key] = {
        value,
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
