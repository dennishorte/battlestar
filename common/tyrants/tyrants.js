const {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
} = require('./../lib/game.js')
const MapZone = require('./MapZone.js')
const Player = require('./Player.js')
const Token = require('./Token.js')
const Zone = require('./Zone.js')
const res = require('./resources.js')
const util = require('../lib/util.js')


module.exports = {
  GameOverEvent,
  Tyrants,
  TyrantsFactory,
  factory: factoryFromLobby,
  res,
}


function Tyrants(serialized_data, viewerName) {
  Game.call(this, serialized_data, viewerName)
}

util.inherit(Game, Tyrants)

function TyrantsFactory(settings, viewerName) {
  const data = GameFactory(settings)
  return new Tyrants(data, viewerName)
}

function factoryFromLobby(lobby) {
  return GameFactory({
    game: 'Tyrants of the Underdark',
    name: lobby.name,
    expansions: lobby.options.expansions,
    map: lobby.options.map,
    players: lobby.users,
    seed: lobby.seed,
  })
}

Tyrants.prototype._mainProgram = function() {
  this.initialize()
  this.chooseInitialLocations()
  this.mainLoop()
}

Tyrants.prototype._gameOver = function(event) {
  this.mLog({
    template: '{player} wins due to {reason}',
    args: {
      player: event.data.player,
      reason: event.data.reason,
    }
  })
  this.gameOver = true
  return event
}

////////////////////////////////////////////////////////////////////////////////
// Initialization

Tyrants.prototype.initialize = function() {
  this.mLog({ template: 'Initializing' })
  this.mLogIndent()

  this.initializePlayers()
  this.initializeZones()
  this.initializeCards()
  this.initializeTokens()
  this.initializeStartingHands()
  this.initializeStartingPlayer()
  this.initializeTransientState()

  this.mLogOutdent()

  this.state.initializationComplete = true
  this._breakpoint('initialization-complete')
}

Tyrants.prototype.initializeZones = function() {
  this.state.zones = {}
  this.initializeMapZones()
  this.initializeMarketZones()
  this.initializePlayerZones()
  this.initializeTokenZones()
  this.state.zones.devoured = new Zone(this, 'devoured', 'public')
}

Tyrants.prototype.initializePlayers = function() {
  this.state.players = []

  for (const p of this.settings.players) {
    const player = new Player()
    player._id = p._id
    player.game = this
    player.name = p.name
    player.points = 0
    this.state.players.push(player)
  }
}

Tyrants.prototype.initializeMapZones = function() {
  this.state.zones.map = util.array.toDict(
    res
      .maps[this.settings.map]
      .map(data => [data.name, new MapZone(data)])
  )
}

Tyrants.prototype.initializeMarketZones = function() {
  this.state.zones.market = new Zone(this, 'market', 'public')
  this.state.zones.priestess = new Zone(this, 'priestess', 'public')
  this.state.zones.guard = new Zone(this, 'guard', 'public')
  this.state.zones.outcast = new Zone(this, 'outcast', 'public')
}

Tyrants.prototype.initializeTokenZones = function() {
  this.state.zones.neutrals = new Zone(this, 'neutrals', 'tokens')
}

Tyrants.prototype.initializePlayerZones = function() {
  this.state.zones.players = {}

  function _addPlayerZone(player, name, kind, root) {
    root[name] = new Zone(this, `players.${player.name}.${name}`, kind)
    root[name].owner = player.name
  }

  for (const player of this.getPlayerAll()) {
    const root = {}
    _addPlayerZone(player, 'deck', 'deck', root)
    _addPlayerZone(player, 'played', 'public', root)
    _addPlayerZone(player, 'discard', 'public', root)
    _addPlayerZone(player, 'trophyHall', 'public', root)
    _addPlayerZone(player, 'hand', 'private', root)
    _addPlayerZone(player, 'innerCircle', 'private', root)

    _addPlayerZone(player, 'troops', 'tokens', root)
    _addPlayerZone(player, 'spies', 'tokens', root)

    this.state.zones.players[player.name] = root
  }
}

Tyrants.prototype.initializeCards = function() {
  this.state.zones.priestess.setCards(res.cards.byName['Priestess of Lolth'])
  this.state.zones.guard.setCards(res.cards.byName['House Guard'])
  this.state.zones.outcast.setCards(res.cards.byName['Insane Outcast'])

  // Market deck
  this.state.zones.marketDeck = new Zone(this, 'marketDeck', 'deck')
  const marketCards = this
    .getExpansionList()
    .flatMap(exp => res.cards.byExpansion[exp])
  this.state.zones.marketDeck.setCards(marketCards)
  this.mShuffle(this.getZoneById('marketDeck'))

  // Market cards
  this.mRefillMarket()

  // Starter decks
  let x = 0
  let y = 0
  for (const player of this.getPlayerAll()) {
    const deck = this.getZoneByPlayer(player, 'deck')
    for (let i = 0; i < 8; i++) {
      const card = res.cards.byName['Noble'][x]
      deck.addCard(card)
      x += 1
    }

    for (let i = 0; i < 2; i++) {
      const card = res.cards.byName['Soldier'][y]
      deck.addCard(card)
      y += 1
    }

    this.mShuffle(deck)
  }
}

Tyrants.prototype.initializeTokens = function() {
  for (const player of this.getPlayerAll()) {
    const troopZone = this.getZoneByPlayer(player, 'troops')
    for (let i = 0; i < 40; i++) {
      const name = `troop-${player.name}`
      const token = new Token(name + '-' + i, name)
      token.isTroop = true
      token.zone = troopZone.id
      token.home = troopZone.id
      token.owner = player
      troopZone.addCard(token)
    }

    const spyZone = this.getZoneByPlayer(player, 'spies')
    for (let i = 0; i < 5; i++) {
      const name = `spy-${player.name}`
      const token = new Token(name + '-' + i, name)
      token.isSpy = true
      token.zone = spyZone.id
      token.home = spyZone.id
      token.owner = player
      spyZone.addCard(token)
    }
  }

  // Neutrals
  const neutralZone = this.getZoneById('neutrals')
  for (let i = 0; i < 40; i++) {
    const name = 'neutral'
    const token = new Token(name + '-' + i, name)
    token.isTroop = true
    token.zone = neutralZone.id
    token.home = neutralZone.id
    neutralZone.addCard(token)
  }

  // Place neutrals on map
  for (const loc of this.getLocationAll()) {
    for (let i = 0; i < loc.neutrals; i++) {
      this.mMoveByIndices(neutralZone, 0, loc, loc.cards().length)
    }
  }
}

Tyrants.prototype.initializeStartingHands = function() {
  for (const player of this.getPlayerAll()) {
    this.mRefillHand(player)
  }
}

Tyrants.prototype.initializeStartingPlayer = function() {
  this.state.currentPlayer = this.getPlayerAll()[0]
}

Tyrants.prototype.initializeTransientState = function() {
  this.state.turn = 0
  this.state.endOfTurnActions = []
}

Tyrants.prototype.chooseInitialLocations = function() {
  this.mLog({ template: 'Choosing starting locations' })
  this.mLogIndent()

  for (const player of this.getPlayerAll()) {
    const choices = this
      .getLocationAll()
      .filter(loc => loc.start)
      .filter(loc => loc.getTroops().filter(t => t.name !== 'neutral').length === 0)

    const loc = this.aChooseLocation(player, choices, { title: 'Choose starting location' })
    this.aDeploy(player, loc)
  }

  this.mLogOutdent()
}


////////////////////////////////////////////////////////////////////////////////
// Main Loop

Tyrants.prototype.mainLoop = function() {
  while (true) {
    this.mLog({
      template: '{player} turn {count}',
      args: {
        player: this.getPlayerCurrent(),
        count: this.getRound(),
      }
    })

    this.mLogIndent()

    this.preActions()
    this.doActions()
    this.endOfTurn()
    this.cleanup()

    this.drawHand()
    this.nextPlayer()

    this.mLogOutdent()
  }
}

Tyrants.prototype.preActions = function() {
  // Gain influence from site control tokens.
}

Tyrants.prototype.doActions = function() {
  const player = this.getPlayerCurrent()

  while (true) {
    const chosenAction = this.requestInputSingle({
      actor: player.name,
      title: `Choose Action`,
      choices: this._generateActionChoices(),
    })[0]

    if (chosenAction === 'Pass') {
      this.mLog({
        template: '{player} passes',
        args: { player }
      })
      break
    }

    const name = chosenAction.title
    const arg = chosenAction.selection[0]

    if (name === 'Play Card') {
      const card = this
        .getCardsByZone(player, 'hand')
        .find(c => c.name === arg)
      this.aPlayCard(player, card)
    }
    else if (name === 'Recruit') {

    }
    else if (name === 'Use Power') {
      if (arg === 'Deploy a Troop') {
        this.aChooseAndDeploy(player)
      }
      else {
        throw new Error(`Unknown power action: ${arg}`)
      }
    }
    else {
      throw new Error(`Unknown action: ${name}`)
    }
  }
}

Tyrants.prototype._generateActionChoices = function() {
  const choices = []
  choices.push(this._generateCardActions())
  choices.push(this._generateBuyActions())
  choices.push(this._generatePowerActions())
  choices.push(this._generatePassAction())
  return choices.filter(action => action !== undefined)
}

Tyrants.prototype._generateCardActions = function() {
  const choices = []
  for (const card of this.getCardsByZone(this.getPlayerCurrent(), 'hand')) {
    choices.push(card.name)
  }

  if (choices.length > 0) {
    return {
      title: 'Play Card',
      choices,
      min: 0,
    }
  }
  else {
    return undefined
  }
}

Tyrants.prototype._generateBuyActions = function() {
  const influence = this.getPlayerCurrent().influence
  const choices = []

  for (const card of this.getZoneById('market').cards()) {
    if (card.cost <= influence) {
      choices.push(card)
    }
  }

  const priestess = this.getZoneById('priestess').cards()[0]
  if (priestess && priestess.cost <= influence) {
    choices.push(priestess)
  }

  const guard = this.getZoneById('guard').cards()[0]
  if (guard && guard.cost <= influence) {
    choices.push(guard)
  }

  if (choices.length > 0) {
    return {
      title: 'Recruit',
      choices,
      min: 0,
    }
  }
  else {
    return undefined
  }
}

Tyrants.prototype._generatePowerActions = function() {
  const player = this.getPlayerCurrent()
  const choices = []

  const power = player.power
  if (power >= 1 && this.getCardsByZone(player, 'troops').length > 0) {
    choices.push('Deploy a Troop')
  }
  if (power >= 3) {
    choices.push('Assassinate a Troop')
    choices.push('Return an Enemy Spy')
  }

  if (choices.length > 0) {
    return {
      title: 'Use Power',
      choices,
      min: 0,
    }
  }
  else {
    return undefined
  }
}

Tyrants.prototype._generatePassAction = function() {
  return 'Pass'
}

Tyrants.prototype._processEndOfTurnActions = function() {
  for (const action of this.state.endOfTurnActions) {
    if (action.action === 'promote-other') {
      const choices = this
        .getCardsByZone(action.player, 'played')
        .filter(card => card !== action.source)
      this.aChooseAndPromote(action.player, choices)
    }
    else {
      throw new Error(`Unknown end of turn action: ${action.action}`)
    }
  }

  this.state.endOfTurnActions = []
}

Tyrants.prototype.endOfTurn = function() {
  this._processEndOfTurnActions()
}

Tyrants.prototype.cleanup = function() {
  const player = this.getPlayerCurrent()
  const playedCards = this.getCardsByZone(player, 'played')

  this.mLog({
    template: '{player} moves {count} played cards to discard pile.',
    args: {
      player,
      count: playedCards.length
    }
  })

  for (const card of playedCards) {
    this.mMoveCardTo(card, this.getZoneByPlayer(player, 'discard'))
  }

  const hand = this.getCardsByZone(player, 'hand')
  if (hand.length > 0) {
    this.mLog({
      template: '{player} discards {count} remaining cards',
      args: { player, count: hand.length }
    })
    for (const card of hand) {
      this.mMoveCardTo(card, this.getZoneByPlayer(player, 'discard'))
    }
  }

  // Clear remaining influence and power
  player.power = 0
  player.influence = 0
}

Tyrants.prototype.drawHand = function() {
  this.mRefillHand(this.getPlayerCurrent())
}

Tyrants.prototype.nextPlayer = function() {
  this.state.currentPlayer = this.getPlayerNext()
  this.state.turn += 1
}


////////////////////////////////////////////////////////////////////////////////
// Core Functionality

Tyrants.prototype.aChoose = function(player, choices, opts={}) {
  if (choices.length === 0) {
    this.mLogNoEffect()
    return []
  }

  const selected = this.requestInputSingle({
    actor: player.name,
    title: opts.title || 'Choose',
    choices: choices,
    ...opts
  })
  if (selected.length === 0) {
    this.mLogDoNothing(player)
    return []
  }
  else {
    /* const choice = selected.join(', ')
     * this.mLog({
     *   template: '{player} chooses {choice}',
     *   args: { player, choice }
     * }) */
    return selected
  }
}

Tyrants.prototype.aChooseCard = function(player, choices, opts={}) {
  const choiceNames = util.array.distinct(choices.map(c => c.name)).sort()
  const selection = this.aChoose(player, choiceNames, opts)
  if (selection.length > 0) {
    return choices.find(c => c.name === selection[0])
  }
  else {
    return undefined
  }
}

Tyrants.prototype.aChooseAndAssassinate = function(player, opts={}) {
  const presence = this.getPresence(player)
  const troops = this
    .getPresence(player)
    .flatMap(loc => loc.getTroops().map(troop => [loc, troop]))
    .filter(([_, troop]) => troop.owner !== player)
    .filter(([_, troop]) => opts.whiteOnly ? troop.owner === undefined : true)
    .map(([loc, troop]) => `${loc.name}, ${troop.getOwnerName()}`)
  const choices = util.array.distinct(troops).sort()

  const selection = this.aChoose(player, choices)
  if (selection.length > 0) {
    const [locName, ownerName] = selection[0].split(', ')
    const loc = this.getLocationByName(locName)
    const owner = ownerName === 'neutral' ? 'neutral' : this.getPlayerByName(ownerName)
    this.aAssassinate(player, loc, owner)
  }
}

Tyrants.prototype.aChooseAndDevourMarket = function(player, opts={}) {
  const chosen = this.aChooseCard(player, this.getZoneById('market').cards(), { min: 0 })
  if (chosen) {
    this.mDevour(player, chosen)
    this.mRefillMarket()
  }
  else {
    this.mLog({
      template: '{player} choose not to devour a card in the market',
      args: { player },
    })
  }
}

Tyrants.prototype.aChooseAndDiscard = function(player, opts={}) {
  const chosen = this.aChooseCard(player, this.getCardsByZone(player, 'hand'), opts)
  if (chosen) {
    this.aDiscard(player, chosen)
    return chosen
  }
  else {
    this.mLog({
      template: '{player} chooses not to discard',
      args: { player }
    })
  }
}

Tyrants.prototype.aChooseAndSupplant = function(player, opts={}) {
  const choices = this._collectTargets(player, opts).troops
  const selection = this.aChoose(player, choices)
  if (selection.length > 0) {
    const [locName, ownerName] = selection[0].split(', ')
    const loc = this.getLocationByName(locName)
    const owner = ownerName === 'neutral' ? 'neutral' : this.getPlayerByName(ownerName)
    this.aSupplant(player, loc, owner)
  }
}

Tyrants.prototype.aChooseAndDeploy = function(player) {
  const troops = this.getCardsByZone(player, 'troops')
  if (troops.length === 0) {
    this.mLog({
      template: '{player} has no more troops',
      args: { player }
    })
    return
  }

  const choices = this
    .getPresence(player)
    .filter(loc => loc.getTroops().length <= loc.size)

  const loc = this.aChooseLocation(player, choices, { title: 'Choose a location to deploy' })
  if (loc) {
    this.aDeploy(player, loc)
  }
}

// Only supports moving troops.
Tyrants.prototype.aChooseAndMoveTroop = function(player, opts={}) {
  const choices = this._collectTargets(player, opts).troops
  const toMove = this.aChoose(player, choices)[0]
  if (toMove) {
    const [locName, ownerName] = toMove.split(', ')
    const source = this.getLocationByName(locName)
    const owner = ownerName === 'neutral' ? 'neutral' : this.getPlayerByName(ownerName)
    const troop = source.getTroops(owner)[0]

    const destChoices = this
      .getLocationAll()
      .filter(loc => loc.checkHasOpenTroopSpace())
      .filter(loc => loc !== source)
      .map(loc => loc.id)
    const destId = this.aChoose(player, destChoices)[0]
    const dest = this.getZoneById(destId)

    util.assert(!!troop, `Invalid selection for moving a troop: ${toMove}`)

    this.mMoveCardTo(troop, dest)
    this.mLog({
      template: '{player} moves a {player2} troop from {zone1} to {zone2}',
      args: {
        player,
        player2: owner,
        zone1: source,
        zone2: dest,
      }
    })
  }
}

Tyrants.prototype.aChooseAndPlaceSpy = function(player) {
  // Check that the player has spies remaining to place.
  if (this.getCardsByZone(player, 'spies').length === 0) {
    this.mLog({
      template: '{player} has deployed all their spies',
      args: { player }
    })
    return
  }

  // Player can choose to place a spy on area site that does not have a spy of theirs on it already.
  const choices = this
    .getLocationAll()
    .filter(l => l.getSpies(player).length === 0)

  const loc = this.aChooseLocation(player, choices, { title: 'Choose a location for a spy' })
  if (loc) {
    this.aPlaceSpy(player, loc)
    return loc
  }
}

Tyrants.prototype.aChooseAndPromote = function(player, choices) {
  const card = this.aChooseCard(player, choices)
  if (card) {
    this.aPromote(player, card)
  }
}

Tyrants.prototype._collectTargets = function(player, opts={}) {
  let baseLocations
  if (opts.loc) {
    baseLocations = [opts.loc]
  }
  else if (opts.anywhere) {
    baseLocations = this.getLocationAll()
  }
  else {
    baseLocations = this.getPresence(player)
  }

  const troops = baseLocations
    .flatMap(loc => loc.getTroops().map(troop => [loc, troop]))
    .filter(([_, troop]) => troop.owner !== player)
    .filter(([_, troop]) => opts.whiteOnly ? troop.owner === undefined : true)
    .filter(([_, troop]) => opts.noWhite ? troop.owner !== undefined : true)
    .map(([loc, troop]) => `${loc.name}, ${troop.getOwnerName()}`)

  const spies = baseLocations
    .flatMap(loc => loc.getSpies().map(spy => [loc, spy]))
    .filter(([_, spy]) => spy.owner !== player)
    .map(([loc, spy]) => `${loc.name}, ${spy.getOwnerName()}`)

  return {
    troops: opts.noTroops ? [] : util.array.distinct(troops).sort(),
    spies: opts.noSpies ? [] : util.array.distinct(spies).sort(),
  }
}

Tyrants.prototype.aChooseAndReturn = function(player, opts={}) {
  const targets = this._collectTargets(player, opts)

  const choices = []
  if (targets.troops.length > 0) {
    choices.push({
      title: 'troop',
      choices: targets.troops,
      min: 0,
    })
  }
  if (targets.spies.length > 0) {
    choices.push({
      title: 'spy',
      choices: targets.spies,
      min: 0,
    })
  }

  const selection = this.aChoose(player, choices, { title: 'Choose a token to return' })
  if (selection.length > 0) {
    const kind = selection[0].title
    const [locName, ownerName] = selection[0].selection[0].split(', ')
    const loc = this.getLocationByName(locName)
    const owner = ownerName === 'neutral' ? 'neutral' : this.getPlayerByName(ownerName)

    if (kind === 'spy') {
      this.aReturnSpy(player, loc, owner)
    }
    else if (kind === 'troop') {
      this.aReturnTroop(player, loc, owner)
    }
    else {
      throw new Error(`Unknown return type: ${kind}`)
    }
  }
}

Tyrants.prototype.aChooseLocation = function(player, choices, opts={}) {
  const ids = choices.map(loc => loc.name)
  const selection = this.aChoose(player, ids, opts)
  if (selection.length > 0) {
    return this.getLocationByName(selection[0])
  }
}

Tyrants.prototype.aChooseOne = function(player, choices, opts={}) {
  const selection = this.aChoose(player, choices.map(c => c.title))[0]
  const impl = choices.find(c => c.title === selection).impl

  this.mLog({
    template: '{player} chooses {selection}',
    args: { player, selection }
  })
  impl(this, player, opts)
}

Tyrants.prototype.aDeferPromotion = function(player, source) {
  this.state.endOfTurnActions.push({
    player,
    source,
    action: 'promote-other',
  })
}

Tyrants.prototype.aAssassinate = function(player, loc, owner) {
  this.mAssassinate(player, loc, owner)
  this.mLog({
    template: '{player1} assassinates {player2} troop at {loc}',
    args: {
      player1: player,
      player2: owner,
      loc
    }
  })
}

Tyrants.prototype.aDeploy = function(player, loc) {
  this.mDeploy(player, loc)
  this.mLog({
    template: '{player} deploys a troop to {loc}',
    args: { player, loc }
  })
}

Tyrants.prototype.aDevour = function(player, card) {
  throw new Error('not implemented')
}

Tyrants.prototype.aDiscard = function(player, card) {
  this.mMoveCardTo(card, this.getZoneByPlayer(player, 'discard'))
  this.mLog({
    template: '{player} discards {card}',
    args: { player, card }
  })
}

Tyrants.prototype.aDraw = function(player, opts={}) {
  const deck = this.getZoneByPlayer(player, 'deck')
  const hand = this.getZoneByPlayer(player, 'hand')

  if (deck.cards().length === 0) {
    // See if we can reshuffle.
    const discard = this.getZoneByPlayer(player, 'discard')
    if (discard.cards().length > 0) {
      this.mReshuffleDiscard(player)
    }

    // If not, do nothing.
    else {
      return 'no-more-cards'
    }
  }

  if (!opts.silent) {
    this.mLog({
      template: '{player} draws a card',
      args: { player }
    })
  }
  this.mMoveByIndices(deck, 0, hand, hand.cards().length)
}

Tyrants.prototype.aMove = function(player, start, end) {

}

Tyrants.prototype.aPlaceSpy = function(player, loc) {
  const spy = this.getCardsByZone(player, 'spies')[0]
  this.mPlaceSpy(player, loc)
  this.mLog({
    template: '{player} places a spy at {loc}',
    args: { player, loc }
  })
}

Tyrants.prototype.aPlayCard = function(player, card) {
  util.assert(card.zone.includes(player.name), 'Card is not owned by player')
  util.assert(card.zone.endsWith('hand'), 'Card is not in player hand')

  this.mMoveCardTo(card, this.getZoneByPlayer(player, 'played'))
  this.mLog({
    template: '{player} plays {card}',
    args: { player, card }
  })

  this.mLogIndent()
  card.impl(this, player, { card })
  this.mLogOutdent()
}

Tyrants.prototype.aPromote = function(player, card) {
  this.mMoveCardTo(card, this.getZoneByPlayer(player, 'innerCircle'))
  this.mLog({
    template: '{player} promotes {card}',
    args: { player, card }
  })
}

Tyrants.prototype.aRecruit = function(player, card) {

}

Tyrants.prototype.aReturnSpy = function(player, loc, owner) {
  const spy = loc.getSpies(owner, loc)[0]
  util.assert(!!spy, `No spy belonging to ${owner.name} at ${loc.name}`)
  this.mReturn(spy)
  this.mLog({
    template: `{player} returns {player2}'s spy from {zone}`,
    args: {
      player,
      player2: owner,
      zone: loc,
    },
  })
}

Tyrants.prototype.aReturnASpyAnd = function(player, fn) {
  // Choose a spy to return
  const locations = this
    .getLocationAll()
    .filter(loc => loc.getSpies(player).length > 0)
  const loc = this.aChooseLocation(player, locations)

  // If a spy was returned, execute fn
  if (loc) {
    this.mLog({
      template: '{player} returns a spy from {loc}',
      args: { player, loc }
    })

    const spy = loc.getSpies(player)[0]
    this.mReturn(spy)

    fn(this, player, { loc })
  }
  else {
    this.mLog({
      template: '{player} has no spies to return',
      args: { player }
    })
  }
}

Tyrants.prototype.aReturnTroop = function(player, loc, owner) {
  const troop = loc.getTroops(owner, loc)[0]
  util.assert(!!troop, `No troop belonging to ${owner.name} at ${loc.name}`)
  this.mReturn(troop)
  this.mLog({
    template: `{player} returns {player2}'s troop from {zone}`,
    args: {
      player,
      player2: owner,
      zone: loc,
    },
  })
}

Tyrants.prototype.aSupplant = function(player, loc, owner) {
  this.mAssassinate(player, loc, owner)
  this.mDeploy(player, loc)
  this.mLog({
    template: '{player1} supplants {player2} troop at {loc}',
    args: {
      player1: player,
      player2: owner,
      loc
    }
  })
}

Tyrants.prototype.getCardById = function(cardId) {
  return res.cards.byId[cardId]
}

Tyrants.prototype.getCardsByZone = function(player, name) {
  return this.getZoneByPlayer(player, name).cards()
}

Tyrants.prototype.getControlMarkers = function(player) {
  const markers = this
    .getLocationAll()
    .map(loc => loc.getControlMarker())
    .filter(marker => marker !== undefined)

  if (player) {
    return markers.filter(marker => marker.ownerName === player.name)
  }
  else {
    return markers
  }
}

Tyrants.prototype.getExpansionList = function() {
  return this.settings.expansions
}

Tyrants.prototype.getLocationAll = function() {
  return Object.values(this.state.zones.map)
}

Tyrants.prototype.getLocationNeighbors = function(loc) {
  return loc
    .neighborNames
    .map(name => this.getLocationByName(name))
    .filter(neighbor => neighbor !== undefined)
}

Tyrants.prototype.getLocationByName = function(name) {
  return this.state.zones.map[name]
}

Tyrants.prototype.getLocationsByPresence = function(player) {
  return this
    .getLocationAll()
    .filter(loc => loc.chechHasPresence(player))
}

Tyrants.prototype.getPlayerAll = function() {
  return this.state.players
}

Tyrants.prototype.getPlayerByCard = function(card) {
  return card.owner
}

Tyrants.prototype.getPlayerByName = function(name) {
  return this.getPlayerAll().find(player => player.name === name)
}

Tyrants.prototype.getPlayerCurrent = function() {
  util.assert(this.state.currentPlayer, 'No current player')
  return this.state.currentPlayer
}

Tyrants.prototype.getPlayerNext = function() {
  const currIndex = this.getPlayerAll().indexOf(this.getPlayerCurrent())
  const nextIndex = (currIndex + 1) % this.getPlayerAll().length
  return this.getPlayerAll()[nextIndex]
}

Tyrants.prototype.getPlayersStarting = function(player) {
  const players = [...this.getPlayerAll()]
  while (players[0] !== player) {
    players.push(players.shift())
  }
  return players
}

Tyrants.prototype.getPresence = function(player) {
  return this
    .getLocationAll()
    .filter(loc => loc.presence.includes(player))
}

Tyrants.prototype.getRound = function() {
  return Math.floor(this.state.turn / this.getPlayerAll().length) + 1
}

Tyrants.prototype.getScore = function(player) {
  // Cards in deck
  const deckCards = [
    ...this.getCardsByZone(player, 'hand'),
    ...this.getCardsByZone(player, 'discard'),
    ...this.getCardsByZone(player, 'deck'),
  ].map(card => card.points)
   .reduce((a, b) => a + b, 0)

  // Cards in inner circle
  const innerCircleCards = this
    .getCardsByZone(player, 'innerCircle')
    .map(card => card.innerPoints)
    .reduce((a, b) => a + b, 0)

  // Captured troops
  const capturedTroops = this.getCardsByZone(player, 'trophyHall').length

  // Locations controlled
  const locationsControlled = this
    .getLocationAll()
    .filter(loc => loc.getController() === player)
    .map(loc => loc.points)
    .reduce((a, b) => a + b, 0)

  const locationsTotalControlled = this
    .getLocationAll()
    .filter(loc => loc.getTotalController() === player)
    .length * 2

  // Victory Points
  const vps = player.points

  return (
    deckCards
    + innerCircleCards
    + capturedTroops
    + locationsControlled
    + locationsTotalControlled
    + vps
  )
}

Tyrants.prototype.getZoneByCard = function(card) {
  return this.getZoneById(card.zone)
}

Tyrants.prototype.getZoneById = function(id) {
  const tokens = id.split('.')
  let curr = this.state.zones
  for (const token of tokens) {
    util.assert(curr.hasOwnProperty(token), `Invalid zone id ${id} at token ${token}`)
    curr = curr[token]
  }
  return curr
}

Tyrants.prototype.getZoneByHome = function(card) {
  return this.getZoneById(card.home)
}

Tyrants.prototype.getZoneByPlayer = function(player, name) {
  return this.state.zones.players[player.name][name]
}

Tyrants.prototype.mAdjustCardVisibility = function(card) {
  if (!this.state.initializationComplete) {
    return
  }

  const zone = this.getZoneByCard(card)

  // Forget everything about a card if it is returned.
  if (zone.kind === 'deck') {
    card.visibility = []
  }

  else if (zone.kind === 'public' || zone.kind === 'tokens' || zone.kind === 'location') {
    card.visibility = this.getPlayerAll().map(p => p.name)
  }

  else if (zone.kind === 'private') {
    util.array.pushUnique(card.visibility, zone.owner)
  }

  else {
    throw new Error(`Unknown zone kind ${zone.kind} for zone ${zone.id}`)
  }
}

Tyrants.prototype.mAdjustPresence = function(source, target, card) {
  if (card.isSpy || card.isTroop) {
    const toUpdate = []

    for (const zone of [source, target]) {
      if (zone.kind === 'location') {
        toUpdate.push(zone)
        this.getLocationNeighbors(zone).forEach(loc => util.array.pushUnique(toUpdate, loc))
      }
    }

    toUpdate
      .forEach(loc => this.mCalculatePresence(loc))
  }
}

Tyrants.prototype.mAssassinate = function(player, loc, owner) {
  const target = loc.getTroops(owner)[0]

  util.assert(!!target, 'No valid target for owner at location')

  this.mMoveCardTo(target, this.getZoneByPlayer(player, 'trophyHall'))
}

Tyrants.prototype.mCalculatePresence = function(location) {
  util.assert(location.kind === 'location')

  const relevant = [
    location,
    ...this.getLocationNeighbors(location)
  ]

  const players = relevant
    .flatMap(loc => loc.cards())
    .map(card => this.getPlayerByCard(card))
    .filter(player => player !== undefined)

  location.presence = util.array.distinct(players)
}

Tyrants.prototype.mCheckZoneLimits = function(zone) {
  if (zone.kind === 'location') {
    util.assert(zone.getTroops().length <= zone.size, `Too many troops in ${zone.id}`)

    const spies = zone.getSpies()
    const uniqueSpies = util.array.distinct(spies.map(spy => spy.owner.name))
    util.assert(spies.length === uniqueSpies.length, `More than one spy per player at ${zone.id}`)
  }
}

Tyrants.prototype.mDeploy = function(player, loc) {
  const troops = this.getCardsByZone(player, 'troops')
  this.mMoveCardTo(troops[0], loc)
}

Tyrants.prototype.mDevour = function(player, card) {
  this.mMoveCardTo(card, this.getZoneById('devoured'))
}

Tyrants.prototype.mMoveByIndices = function(source, sourceIndex, target, targetIndex) {
  util.assert(sourceIndex >= 0 && sourceIndex <= source.cards().length - 1, `Invalid source index ${sourceIndex}`)
  const sourceCards = source._cards
  const targetCards = target._cards
  const card = sourceCards[sourceIndex]
  sourceCards.splice(sourceIndex, 1)
  targetCards.splice(targetIndex, 0, card)
  card.zone = target.id
  this.mCheckZoneLimits(target)
  this.mAdjustCardVisibility(card)
  this.mAdjustPresence(source, target, card)
  return card
}

Tyrants.prototype.mMoveCardTo = function(card, zone, opts={}) {
  if (opts.verbose) {
    this.mLog({
      template: 'Moving {card} to {zone}',
      args: { card, zone }
    })
  }

  const source = this.getZoneByCard(card)
  const index = source.cards().indexOf(card)
  this.mMoveByIndices(source, index, zone, zone.cards().length)
}

Tyrants.prototype.mPlaceSpy = function(player, loc) {
  const spy = this.getCardsByZone(player, 'spies')[0]
  this.mMoveCardTo(spy, loc)
}

Tyrants.prototype.mReshuffleDiscard = function(player) {
  const discard = this.getZoneByPlayer(player, 'discard')
  const deck = this.getZoneByPlayer(player, 'deck')

  util.assert(discard.cards().length > 0, 'Cannot reshuffle empty discard.')
  util.assert(deck.cards().length === 0, 'Cannot reshuffle discard when deck is not empty.')

  this.mLog({
    template: '{player} shuffles their discard into their deck',
    args: { player }
  })
  this.mLogIndent()
  this.mLog({
    template: '{count} cards reshuffled',
    args: {
      count: discard.cards().length
    }
  })
  this.mLogOutdent()

  for (const card of discard.cards()) {
    this.mMoveCardTo(card, deck)
  }

  this.mShuffle(deck)
}

Tyrants.prototype.mReturn = function(item) {
  this.mMoveCardTo(item, this.getZoneByHome(item))
}

Tyrants.prototype.mShuffle = function(zone) {
  util.array.shuffle(zone._cards, this.random)
}

Tyrants.prototype.mRefillHand = function(player) {
  const deck = this.getZoneByPlayer(player, 'deck')
  const hand = this.getZoneByPlayer(player, 'hand')

  this.mLog({
    template: '{player} refills their hand',
    args: { player }
  })
  this.mLogIndent()

  const drawnAfterShuffle = Math.min(
    Math.max(0, 5 - deck.cards().length),  // Number of cards left to draw after reshuffling
    this.getCardsByZone(player, 'discard').length  // Number of cards in discard pile
  )

  if (deck.cards().length < 5) {
    this.mLog({
      template: '{player} draws the remaining {count} cards from deck',
      args: {
        player,
        count: deck.cards().length
      }
    })
  }

  while (hand.cards().length < 5) {
    const drawResult = this.aDraw(player, { silent: true })
    if (drawResult === 'no-more-cards') {
      break
    }
  }

  if (drawnAfterShuffle) {
    this.mLog({
      template: '{player} draws an additional {count} cards',
      args: {
        player,
        count: drawnAfterShuffle
      }
    })
  }

  this.mLogOutdent()
}

Tyrants.prototype.mRefillMarket = function() {
  const deck = this.getZoneById('marketDeck')
  const market = this.getZoneById('market')
  const count = 6 - market.cards().length

  for (let i = 0; i < count; i++) {
    const card = deck.cards()[0]

    if (!card) {
      throw new Error('No cards in market')
    }

    this.mLog({
      template: '{card} added to the market',
      args: { card }
    })

    this.mMoveCardTo(card, market)
  }
}

Tyrants.prototype._enrichLogArgs = function(msg) {
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
    else if (key.startsWith('loc')) {
      const loc = msg.args[key]
      msg.args[key] = {
        value: loc.name,
        classes: ['location-name']
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
