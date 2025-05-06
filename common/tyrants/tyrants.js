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
const res = require('./res/index.js')
const util = require('../lib/util.js')


module.exports = {
  GameOverEvent,
  Tyrants,
  TyrantsFactory,

  constructor: Tyrants,
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
    menzoExtraNeutral: lobby.options.menzoExtraNeutral,
    players: lobby.users,
    seed: lobby.seed,
    chooseColors: true,
  })
}

Tyrants.prototype._mainProgram = function() {
  this.initialize()
  this.chooseInitialLocations()
  this.mainLoop()
}


////////////////////////////////////////////////////////////////////////////////
// Initialization

Tyrants.prototype.initialize = function() {
  this.mLog({ template: 'Initializing' })
  this.mLogIndent()

  this.state.reduceDraw = {}

  this.initializePlayers()
  this.initializeZones()
  this.initializeCards()
  this.initializeTokens()
  this.initializeStartingHands()
  this.initializeStartingPlayer()
  this.initializeTransientState()

  this.mLogOutdent()

  this.state.ghostFlag = false
  this.state.initializationComplete = true
  this.doingSetup = true
  this._breakpoint('initialization-complete')
  this.doingSetup = false
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
    player.team = p.name
    player.points = 0
    this.state.players.push(player)
    this.state.reduceDraw[player.name] = 0
  }

  util.array.shuffle(this.state.players, this.random)
  this.mLog({ template: 'Seating shuffled' })
}

Tyrants.prototype.initializeMapZones = function() {
  this.state.zones.map = Object.fromEntries(
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
    _addPlayerZone(player, 'innerCircle', 'public', root)

    _addPlayerZone(player, 'troops', 'tokens', root)
    _addPlayerZone(player, 'spies', 'tokens', root)

    this.state.zones.players[player.name] = root
  }
}

Tyrants.prototype.initializeCards = function() {
  const expansions = this.getExpansionList()

  this.mLog({ template: 'Loading expansion: ' + expansions[0] })
  this.mLog({ template: 'Loading expansion: ' + expansions[1] })

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
  this.mLog({ template: 'Adding starting market cards' })
  this.mLogIndent()
  this.mRefillMarket(true)
  this.mLogOutdent()

  // Starter decks
  let x = 0
  let y = 0
  for (const player of this.getPlayerAll()) {
    const deck = this.getZoneByPlayer(player, 'deck')
    for (let i = 0; i < 7; i++) {
      const card = res.cards.byName['Noble'][x]
      deck.addCard(card)
      x += 1
    }

    for (let i = 0; i < 3; i++) {
      const card = res.cards.byName['Soldier'][y]
      deck.addCard(card)
      y += 1
    }

    this.mShuffle(deck)
  }
}

Tyrants.prototype.initializeTokens = function() {
  this.state.tokenLookup = {}

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
      this.state.tokenLookup[token.id] = token
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
      this.state.tokenLookup[token.id] = token
    }
  }

  // Neutrals
  const neutralZone = this.getZoneById('neutrals')
  for (let i = 0; i < 80; i++) {
    const name = 'neutral'
    const token = new Token(name + '-' + i, name)
    token.isTroop = true
    token.zone = neutralZone.id
    token.home = neutralZone.id
    neutralZone.addCard(token)
    this.state.tokenLookup[token.id] = token
  }

  // Place neutrals on map
  for (const loc of this.getLocationAll()) {
    for (let i = 0; i < loc.neutrals; i++) {
      this.mMoveByIndices(neutralZone, 0, loc, loc.cards().length)
    }
  }

  if (this.settings.menzoExtraNeutral) {
    const neutralZone = this.getZoneById('neutrals')
    const menzo = this.getLocationByName('Menzoberranzan')
    this.mMoveByIndices(neutralZone, 0, menzo, menzo.cards().length)
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
    this.aChooseColor(player)

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
    this.mLogSetIndent(0)
    this.mLog({
      template: '{player} turn {count}',
      args: {
        player: this.getPlayerCurrent(),
        count: this.getRound(),
      },
      classes: ['player-turn'],
    })

    this.mLogIndent()

    this.preActions()
    this.doActions()

    this.mLogIndent()
    this.endOfTurn()
    this.cleanup()

    this.drawHand()
    this.nextPlayer()
    this.checkForEndOfGame()
  }
}

Tyrants.prototype.preActions = function() {
  const player = this.getPlayerCurrent()

  // Gain influence from site control tokens.
  const markers = this.getControlMarkers(player)
  for (const marker of markers) {
    const loc = this.getLocationByName(marker.locName)
    player.incrementInfluence(marker.influence, { silent: true })
    this.mLog({
      template: '{player} gains {count} influence for control of {loc}',
      args: {
        player,
        loc,
        count: marker.influence
      }
    })
  }
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

    else if (chosenAction === 'Auto-play Cards') {
      this.aAutoPlayCards()
      continue
    }

    else if (chosenAction.action === 'place-troop-with-power') {
      this.aDeployWithPowerAt(player, chosenAction.location)
      continue
    }

    const name = chosenAction.title
    const arg = chosenAction.selection[0]

    if (name === 'Play Card') {
      const card = this
        .getCardsByZone(player, 'hand')
        .find(c => c.name === arg)
      this.aPlayCard(player, card)
      continue
    }
    else if (name === 'Recruit') {
      this.mLog({
        template: '{player} recruit',
        args: { player }
      })
      this.mLogIndent()
      this.aRecruit(player, arg)
      this.mLogOutdent()
      continue
    }
    else if (name === 'Use Power') {
      if (arg === 'Deploy a Troop') {
        this.aDeployWithPowerAt(player)
        continue
      }

      else if (arg === 'Assassinate a Troop') {
        this.mLog({
          template: '{player} power: Assassinate a Troop',
          args: { player }
        })
        this.mLogIndent()
        this.aChooseAndAssassinate(player)
        player.incrementPower(-3)
        this.mLogOutdent()
        continue
      }

      else if (arg === 'Return an Enemy Spy') {
        this.mLog({
          template: '{player} power: Return an Enemy Spy',
          args: { player }
        })
        this.mLogIndent()
        this.aChooseAndReturn(player, { noTroops: true })
        player.incrementPower(-3)
        this.mLogOutdent()
        continue
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
  choices.push(this._generateAutoCardAction())
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

  choices.sort()

  if (choices.length > 0) {
    return {
      title: 'Play Card',
      choices,
      min: 0,
      max: 1,
    }
  }
  else {
    return undefined
  }
}

Tyrants.prototype._generateAutoCardAction = function() {
  const player = this.getPlayerCurrent()
  const cards = this.getCardsByZone(player, 'hand')

  if (cards.some(card => card.autoplay)) {
    return 'Auto-play Cards'
  }
  else {
    return undefined
  }
}

Tyrants.prototype._generateBuyActions = function(maxCost=0, opts={}) {
  const choices = []

  const priestess = this.getZoneById('priestess').cards()[0]
  if (priestess) {
    choices.push({ card: priestess })
  }

  const guard = this.getZoneById('guard').cards()[0]
  if (guard) {
    choices.push({ card: guard })
  }

  const market = this
    .getZoneById('market')
    .cards()
    .sort((l, r) => l.name.localeCompare(r.name))
    .sort((l, r) => l.cost - r.cost)
  for (const card of market) {
    choices.push({ card })
  }

  if (this.state.ghostFlag) {
    const devoured = this.getZoneById('devoured').cards().slice(-1)[0]
    if (devoured) {
      choices.push({
        card: devoured,
        devoured: true,
      })
    }
  }

  const influence = maxCost ? maxCost : this.getPlayerCurrent().influence
  const filteredChoices = choices
    .filter(choice => choice.card.cost <= influence)
    .filter(choice => opts.aspect ? choice.card.aspect === opts.aspect : true)
    .map(choice => {
      if (choice.devoured) {
        return 'devoured: ' + choice.card.name
      }
      else {
        return choice.card.name
      }
    })

  if (filteredChoices.length > 0) {
    return {
      title: 'Recruit',
      choices: filteredChoices,
      min: 0,
      max: 1,
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
  if (
    power >= 1
    && this.getCardsByZone(player, 'troops').length > 0
    && this.getDeployChoices(player).length > 0
  ) {
    choices.push('Deploy a Troop')
  }
  if (power >= 3) {
    if (this.getAssassinateChoices(player).length > 0) {
      choices.push('Assassinate a Troop')
    }

    if (this._collectTargets(player).spies.length > 0) {
      choices.push('Return an Enemy Spy')
    }
  }

  if (choices.length > 0) {
    return {
      title: 'Use Power',
      choices,
      min: 0,
      max: 1,
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
  // Discard
  for (const action of this.state.endOfTurnActions) {
    if (action.action === 'discard') {
      this.mLog({
        template: '{player} must discard a card due to {card}',
        args: { player: action.player, card: action.source }
      })
      this.aChooseAndDiscard(action.player, { forced: true, forcedBy: action.forcedBy })
    }
  }

  // Promotions
  const promos = []

  for (const action of this.state.endOfTurnActions) {
    if (action.action === 'promote-other') {
      promos.push(action)
    }

    else if (action.action === 'promote-aspect') {
      this.mLog({
        template: '{player} may promote a card with aspect {aspect}',
        args: {
          player: action.player,
          aspect: action.aspect,
        }
      })
      const choices = this
        .getCardsByZone(action.player, 'played')
        .filter(card => card.aspect === action.aspect)
        .sort(card => card.name)
      this.aChooseAndPromote(action.player, choices, { min: 1, max: 1 })
    }

    else if (action.action === 'promote-special') {
      if (action.source.name === 'High Priest of Myrkul') {
        this.mLog({
          template: '{player} may promote any number of undead cards',
          args: { player: action.player }
        })
        const choices = this
          .getCardsByZone(action.player, 'played')
          .filter(card => card.race === 'undead')
          .sort(card => card.name)
        this.aChooseAndPromote(action.player, choices, { min: 0, max: choices.length })
      }
      else {
        throw new Error(`Unknown special promotion: ${action.source.name}`)
      }
    }
  }

  const promoChoices = []
  for (const promo of promos) {
    this
      .getCardsByZone(promo.player, 'played')
      .filter(card => card !== promo.source)
      .forEach(card => util.array.pushUnique(promoChoices, card))
  }

  if (promoChoices.length > 0) {
    const player = this.getPlayerCurrent()

    const max = promos.length
    const min = promos.filter(p => !p.opts.optional).length

    this.mLog({
      template: '{player} may promote {max} cards',
      args: { player, max }
    })
    promoChoices.sort((l, r) => l.name.localeCompare(r.name))
    this.aChooseAndPromote(player, promoChoices, { min, max })
  }

  // Special

  for (const action of this.state.endOfTurnActions) {
    if (action.action === 'special') {
      action.fn(this, action.player)
    }
  }

  this.state.endOfTurnActions = []
}

Tyrants.prototype.endOfTurn = function() {
  this._processEndOfTurnActions()

  // Gain points for control markers.
  const player = this.getPlayerCurrent()

  const markers = this.getControlMarkers(player)
  for (const marker of markers) {
    if (marker.total && marker.points) {
      player.incrementPoints(marker.points, { silent: true })
      this.mLog({
        template: '{player} gains {count} points for total control of {loc}',
        args: {
          player,
          loc: this.getLocationByName(marker.locName),
          count: marker.points
        }
      })
    }
  }

  // Clear till end of turn flags
  this.state.ghostFlag = false
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

  this.checkForEndGameTriggers()
}

Tyrants.prototype.checkForEndGameTriggers = function() {

  // Any player has zero troops left
  for (const player of this.getPlayerAll()) {
    if (this.getCardsByZone(player, 'troops').length === 0) {
      this.mLog({
        template: '{player} has deployed all of their troops',
        args: { player }
      })
      this.state.endGameTriggered = true
    }
  }

  // The market is depleted
  if (this.getZoneById('marketDeck').cards().length === 0) {
    this.mLog({
      template: 'The market is depleted'
    })
    this.state.endGameTriggered = true
  }

  if (this.state.endGameTriggered) {
    this.mLog({
      template: "The end of the game has been triggered. The game will end at the start of {player}'s next turn.",
      args: { player: this.getPlayerFirst() }
    })
  }
}

Tyrants.prototype.drawHand = function() {
  this.mRefillHand(this.getPlayerCurrent())
}

Tyrants.prototype.nextPlayer = function() {
  this.state.currentPlayer = this.getPlayerNext()
  this.state.turn += 1
}

Tyrants.prototype.checkForEndOfGame = function() {
  if (this.state.endGameTriggered && this.state.currentPlayer === this.getPlayerFirst()) {

    const scores = this
      .getPlayerAll()
      .map(p => [p, this.getScore(p)])
      .sort((l, r) => r[1] - l[1])
    const winner = scores[0][0]

    throw new GameOverEvent({
      player: winner.name,
      reason: 'ALL THE POINTS!'
    })
  }
}


////////////////////////////////////////////////////////////////////////////////
// Alt Actions

Tyrants.prototype.aDeployWithPowerAt = function(player, locId=null) {
  this.mLog({
    template: '{player} power: Deploy a Troop',
    args: { player }
  })
  this.mLogIndent()

  if (locId) {
    const loc = this.getLocationByName(locId)
    this.aDeploy(player, loc)
  }
  else {
    this.aChooseAndDeploy(player)
  }

  player.incrementPower(-1)
  this.mLogOutdent()
}


////////////////////////////////////////////////////////////////////////////////
// Core Functionality

Tyrants.prototype.aCascade = function(player, opts) {
  const marketZone = this.getZoneById('marketDeck')

  const unused = []
  let found = null

  for (const card of marketZone.cards()) {
    if (card[opts.key] === opts.value && card.cost <= opts.maxCost) {
      found = card
      break
    }
    else {
      this.mLog({
        template: 'skipping {card}',
        args: { card }
      })
      unused.push(card)
    }
  }

  for (const card of unused) {
    this.mMoveCardTo(card, marketZone)
  }

  if (found) {
    this.mLog({
      template: '{card} found',
      args: { card: found }
    })
    this.mMoveCardTo(found, this.getZoneByPlayer(player, 'hand'))
    this.aPlayCard(player, found)

    // If the player devoured the card as part of using it, they cannot acquire it.
    if (this.getZoneByCard(found).id === 'devoured') {
      this.mLog({
        template: '{card} cannot be acquired because it was devoured',
        args: { card: found }
      })
      return
    }

    if (this.aChooseYesNo(player, 'Acquire ' + found.name + '?')) {
      this.mLog({
        template: '{player} adds {card} to their deck',
        args: { player, card: found }
      })
      this.mMoveCardTo(found, this.getZoneByPlayer(player, 'discard'))
    }
    else {
      this.aDevour(player, found)
    }
  }
  else {
    this.mLog({ template: 'No cards found' })
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

Tyrants.prototype.aChooseCards = function(player, choices, opts={}) {
  const choiceNames = choices.map(c => c.name).sort()
  const selection = this.aChoose(player, choiceNames, opts)
  const used = []

  return selection.map(s => {
    const card = choices.find(c => c.name === s && !used.includes(c))
    used.push(card)
    return card
  })
}

Tyrants.prototype.aChooseColor = function(player) {
  // This option exists so that games in progress when color selection is introduced don't break
  if (!this.settings.chooseColors) {
    return
  }

  const availableColors = Object
    .entries(res.colors)
    .filter(([_, hex]) => !this.getPlayerAll().some(p => p.color === hex))
    .map(([name, _]) => name)

  const chosen = this.aChoose(player, availableColors, {
    title: 'Choose a player color',
  })
  player.color = res.colors[chosen]
}

Tyrants.prototype.aChoosePlayer = function(player, choices, opts={}) {
  const names = choices.map(p => p.name)
  const chosen = this.aChoose(player, names, opts)
  return choices.find(p => p.name === chosen[0])
}

Tyrants.prototype.aChooseLocation = function(player, locations, opts={}) {
  const choices = locations
    .map(loc => loc.name)
    .sort()

  if (!opts.title) {
    opts.title = 'Choose a location'
  }

  const selection = this.aChoose(player, choices, opts)
  if (selection.length > 0) {
    return locations.find(loc => loc.name === selection[0])
  }
}

Tyrants.prototype.aChooseAndAssassinate = function(player, opts={}) {
  const choices = this.getAssassinateChoices(player, opts)
  const selection = this.aChoose(player, choices)
  if (selection.length > 0) {
    const [locName, ownerName] = selection[0].split(', ')
    const loc = this.getLocationByName(locName)
    const owner = ownerName === 'neutral' ? 'neutral' : this.getPlayerByName(ownerName)
    return this.aAssassinate(player, loc, owner)
  }
}

Tyrants.prototype.aChooseAndDevour = function(player, opts={}) {
  const zoneName = opts.zone ? opts.zone : 'hand'
  const chosen = this.aChooseCard(player, this.getCardsByZone(player, zoneName), {
    min: 0,
    max: 1,
    title: `Devour a card from your ${zoneName}?`,
  })
  if (chosen) {
    this.aDevour(player, chosen)
    if (opts.then) {
      opts.then({ card: chosen })
    }
  }
  else {
    this.mLog({
      template: '{player} choose not to devour a card',
      args: { player },
    })
  }
}

Tyrants.prototype.aChooseAndDevourMarket = function(player, opts={}) {
  const chosen = this.aChooseCards(player, this.getZoneById('market').cards(), {
    min: 0,
    max: opts.max || 1,
    title: 'Choose cards to devour from the market',
  })
  if (chosen.length > 0) {
    for (const card of chosen) {
      this.aDevour(player, card)
    }
  }
  else {
    this.mLog({
      template: '{player} choose not to devour a card in the market',
      args: { player },
    })
  }
}

Tyrants.prototype.aChooseAndDiscard = function(player, opts={}) {
  if (opts.requireThree) {
    const cardsInHand = this.getCardsByZone(player, 'hand').length
    if (cardsInHand <= 3) {
      this.mLog({
        template: '{player} has only {count} cards in hand, so does not discard',
        args: { player, count: cardsInHand }
      })
      return
    }
  }

  this.mLog({
    template: '{player} must discard a card',
    args: { player }
  })
  this.mLogIndent()

  if (!opts.title) {
    opts.title = 'Choose a card to discard'
  }

  const chosen = this.aChooseCard(player, this.getCardsByZone(player, 'hand'), opts)
  if (chosen) {
    // Some cards have triggers if an opponent causes you to discard.
    if (opts.forced) {
      const triggers = chosen.triggers || []
      for (const trigger of triggers) {
        if (trigger.kind === 'discard-this') {
          const result = trigger.impl(this, player, { card: chosen, forcedBy: opts.forcedBy })
          this.mLogOutdent()
          return result
        }
      }
    }

    // Only get to this on fall-through
    this.aDiscard(player, chosen)
    this.mLogOutdent()
    return chosen
  }
  else {
    this.mLog({
      template: '{player} cannot or chooses not to discard',
      args: { player }
    })
  }

  this.mLogOutdent()
}

Tyrants.prototype.aChooseAndSupplant = function(player, opts={}) {
  const troops = this.getCardsByZone(player, 'troops')
  if (troops.length === 0) {
    this.mLog({
      template: '{player} has no more troops',
      args: { player }
    })
    return
  }

  const choices = this._collectTargets(player, opts).troops
  const selection = this.aChoose(player, choices)
  if (selection.length > 0) {
    const [locName, ownerName] = selection[0].split(', ')
    const loc = this.getLocationByName(locName)
    const owner = ownerName === 'neutral' ? 'neutral' : this.getPlayerByName(ownerName)
    this.aSupplant(player, loc, owner)
  }
}

Tyrants.prototype.aChooseAndDeploy = function(player, opts={}) {
  // If the player is deploying a white troop, fetch it from the bank.
  if (opts.white) {
    const white = this.getZoneById('neutrals').cards()[0]
    if (!white) {
      this.mLog({ template: 'There are no neutral troops left in the supply' })
      return
    }
    opts.troop = white
  }

  // Ensure there are troops to be deployed
  const troops = this.getCardsByZone(player, 'troops')
  if (troops.length === 0 && !opts.troop) {
    this.mLog({
      template: '{player} has no more troops',
      args: { player }
    })
    return
  }

  const choices = this.getDeployChoices(player, opts)
  const loc = this.aChooseLocation(player, choices, { title: 'Choose a location to deploy' })
  if (loc) {
    this.aDeploy(player, loc, opts)
  }

  return loc
}

// Only supports moving troops.
Tyrants.prototype.aChooseAndMoveTroop = function(player, opts={}) {
  const choices = this._collectTargets(player, opts).troops
  const toMove = this.aChoose(player, choices, { title: "Choose a troop to move" })[0]
  if (toMove) {
    const [locName, ownerName] = toMove.split(', ')
    const source = this.getLocationByName(locName)
    const owner = ownerName === 'neutral' ? 'neutral' : this.getPlayerByName(ownerName)
    const troop = source.getTroops(owner)[0]

    const destChoices = this
      .getLocationAll()
      .filter(loc => loc.checkHasOpenTroopSpace())
      .filter(loc => loc !== source)

    const dest = this.aChooseLocation(player, destChoices)

    if (!dest) {
      this.mLog({ template: 'No valid targets for moving a troop' })
      return
    }

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
    .filter(l => l.checkIsSite())
    .filter(l => l.getSpies(player).length === 0)

  const loc = this.aChooseLocation(player, choices, { title: 'Choose a location for a spy' })
  if (loc) {
    this.aPlaceSpy(player, loc)
    return loc
  }
}

Tyrants.prototype.aChooseAndPromote = function(player, cardsToChoose, opts={}) {
  const choiceNames = cardsToChoose
    .map(c => c.name)
    .sort()

  const choices = this.aChoose(player, choiceNames, { ...opts, title: 'Choose cards to promote' })

  const done = []
  for (const choice of choices) {
    const card = cardsToChoose.find(c => c.name === choice && !done.includes(c))
    done.push(card)
    this.aPromote(player, card)
  }
}

Tyrants.prototype.aChooseAndRecruit = function(player, maxCost, opts) {
  const choices = this._generateBuyActions(maxCost, opts)

  if (choices) {
    const cardNames = this.aChoose(player, choices.choices, { ...opts, title: 'Choose cards to recruit' })
    for (const name of cardNames) {
      this.aRecruit(player, name, { noCost: true })
    }
  }
  else {
    this.mLog({ template: 'Not able to recruit any cards' })
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
      max: 1,
    })
  }
  if (targets.spies.length > 0) {
    choices.push({
      title: 'spy',
      choices: targets.spies,
      min: 0,
      max: 1,
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

Tyrants.prototype.aChooseOne = function(player, choices, opts={}) {
  const selection = this.aChoose(player, choices.map(c => c.title))[0]
  const impl = choices.find(c => c.title === selection).impl

  this.mLog({
    template: '{player} chooses {selection}',
    args: { player, selection }
  })
  impl(this, player, opts)
}

Tyrants.prototype.aChooseToDiscard = function(player, opts={}) {
  const opponents = this
    .getPlayerOpponents(player)
    .filter(p => this.getCardsByZone(p, 'hand').length > 3)
    .map(p => p.name)

  const choice = this.aChoose(player, opponents, { title: 'Choose an opponent to discard' })
  if (choice.length > 0) {
    const opponent = this.getPlayerByName(choice[0])
    this.aChooseAndDiscard(opponent, { forced: true, forcedBy: player.name })
  }
  else {
    this.mLog({
      template: 'No opponents have more than three cards in hand',
    })
  }
}

Tyrants.prototype.aDeferDiscard = function(player, source, forcingPlayer) {
  this.state.endOfTurnActions.push({
    player,
    source,
    action: 'discard',
    forcedBy: forcingPlayer.name,
  })
}

Tyrants.prototype.aDeferPromotion = function(player, source, opts={}) {
  this.state.endOfTurnActions.push({
    player,
    source,
    action: 'promote-other',
    opts,
  })
}

Tyrants.prototype.aDeferPromotionAspect = function(player, source, aspect) {
  this.state.endOfTurnActions.push({
    player,
    source,
    aspect,
    action: 'promote-aspect',
  })
}

Tyrants.prototype.aDeferPromotionSpecial = function(player, source) {
  this.state.endOfTurnActions.push({
    player,
    source,
    action: 'promote-special',
  })
}

Tyrants.prototype.aDeferSpecial = function(player, source, fn) {
  this.state.endOfTurnActions.push({
    player,
    source,
    action: 'special',
    fn,
  })
}

Tyrants.prototype.aAutoPlayCards = function() {
  const player = this.getPlayerCurrent()
  const cards = this.getCardsByZone(player, 'hand')
  for (const card of cards) {
    if (card.autoplay) {
      this.aPlayCard(player, card)
    }
  }
}

Tyrants.prototype.aAssassinate = function(player, loc, owner) {
  const troop = this.mAssassinate(player, loc, owner)
  this.mLog({
    template: '{player} assassinates {card} at {loc}',
    args: {
      player,
      card: troop,
      loc
    }
  })
  return troop
}

Tyrants.prototype.aDeploy = function(player, loc, opts={}) {
  const deployed = this.mDeploy(player, loc, opts)
  this.mLog({
    template: '{player} deploys {card} to {loc}',
    args: { player, loc, card: deployed }
  })
}

Tyrants.prototype.aDevour = function(player, card, opts={}) {
  const zone = this.getZoneByCard(card)
  this.mDevour(card)
  this.mLog({
    template: '{player} devours {card} from {zone}',
    args: { player, card, zone },
  })

  if (!opts.noRefill) {
    this.mRefillMarket()
  }
}

Tyrants.prototype.aDevourThisAnd = function(player, card, title, fn) {
  this.mLog({
    template: `{player} may activate '${title}'`,
    args: { player }
  })
  this.mLogIndent()
  const doDevour = this.aChooseYesNo(player, title)
  if (doDevour) {
    this.aDevour(player, card)
    fn(this, player)
  }
  else {
    this.mLogDoNothing(player)
  }
  this.mLogOutdent()
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
  return this.mMoveByIndices(deck, 0, hand, hand.cards().length)
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

  this.mExecuteCard(player, card)
}

Tyrants.prototype.aPromote = function(player, card, opts={}) {
  if (card.name === 'Insane Outcast') {
    this.mMoveCardTo(card, this.getZoneById('outcast'))
  }
  else {
    this.mMoveCardTo(card, this.getZoneByPlayer(player, 'innerCircle'))
  }

  if (!opts.silent) {
    this.mLog({
      template: '{player} promotes {card}',
      args: { player, card }
    })
  }
  return card
}

Tyrants.prototype.aPromoteTopCard = function(player) {
  const deck = this.getZoneByPlayer(player, 'deck')

  if (deck.cards().length === 0) {
    // See if we can reshuffle.
    const discard = this.getZoneByPlayer(player, 'discard')
    if (discard.cards().length > 0) {
      this.mReshuffleDiscard(player)
    }

    // If not, do nothing.
    else {
      this.mLog({
        template: '{player} has no cards in deck or discard pile',
        args: { player }
      })
      return
    }
  }

  this.mLog({ template: 'Promoting top card of deck' })
  this.mLogIndent()
  this.aPromote(player, deck.cards()[0])
  this.mLogOutdent()
}

Tyrants.prototype.aRecruit = function(player, cardName, opts={}) {
  let card

  if (cardName.startsWith('devoured: ')) {
    card = this.getZoneById('devoured').cards().slice(-1)[0]
  }
  else if (cardName === 'Priestess of Lolth') {
    card = this.getZoneById('priestess').cards()[0]
  }
  else if (cardName === 'House Guard') {
    card = this.getZoneById('guard').cards()[0]
  }
  else if (cardName === 'Insane Outcast') {
    card = this.getZoneById('outcast').cards()[0]

    if (!card) {
      this.mLogIndent()
      this.mLog({ template: 'No more insane outcasts remaining' })
      this.mLogOutdent()
      return
    }
  }
  else {
    const market = this.getZoneById('market').cards()
    card = market.find(c => c.name === cardName)
  }

  util.assert(!!card, `Unable to find card to recruit: ${cardName}`)

  this.mMoveCardTo(card, this.getZoneByPlayer(player, 'discard'))

  if (!opts.noCost) {
    player.incrementInfluence(-card.cost)
  }

  this.mLog({
    template: '{player} recruits {card}',
    args: { player, card }
  })

  this.mRefillMarket()
}

// Player will draw one less card the next time they refill their hand.
Tyrants.prototype.aReduceDraw = function(player) {
  this.state.reduceDraw[player.name] += 1
}

Tyrants.prototype.aReturnSpy = function(player, loc, owner) {
  const spy = loc.getSpies(owner, loc)[0]
  util.assert(!!spy, `No spy belonging to ${owner.name} at ${loc.name}`)
  this.mReturn(spy)
  this.mLog({
    template: `{player} returns {card} from {zone}`,
    args: {
      player,
      card: spy,
      zone: loc,
    },
  })
}

Tyrants.prototype.aReturnASpyAnd = function(player, fn) {
  // Choose a spy to return
  const locations = this
    .getLocationAll()
    .filter(loc => loc.getSpies(player).length > 0)

  if (locations.length === 0) {
    this.mLog({
      template: '{player} has no spies to return',
      args: { player }
    })
  }

  const loc = this.aChooseLocation(player, locations, { min: 0, max: 1 })

  // If a spy was returned, execute fn
  if (loc) {
    const spy = loc.getSpies(player)[0]

    this.mLog({
      template: `{player} returns {card} from {zone}`,
      args: {
        player,
        card: spy,
        zone: loc,
      },
    })

    this.mReturn(spy)

    fn(this, player, { loc })
  }
  else {
    this.mLog({
      template: '{player} chooses not to return a spy',
      args: { player }
    })
  }
}

Tyrants.prototype.aReturnTroop = function(player, loc, owner) {
  const troop = loc.getTroops(owner, loc)[0]
  util.assert(!!troop, `No troop belonging to ${owner.name} at ${loc.name}`)
  this.mLog({
    template: `{player} returns {card} from {zone}`,
    args: {
      player,
      card: troop,
      zone: loc,
    },
  })
  this.mReturn(troop)
}

Tyrants.prototype.aSupplant = function(player, loc, owner) {
  this.mAssassinate(player, loc, owner)
  this.mDeploy(player, loc)

  owner = owner ? owner : 'neutral'

  this.mLog({
    template: '{player1} supplants {player2} troop at {loc}',
    args: {
      player1: player,
      player2: owner,
      loc
    }
  })
}

Tyrants.prototype.aWithFocus = function(player, test, fn) {
  const played = this.getCardsByZone(player, 'played')
  const playedAspect = played
    .filter(card => test(card))
    .length > 1

  if (playedAspect) {
    this.mLog({
      template: '{player} has already played a matching focus card',
      args: { player }
    })
    fn()
    return
  }

  const inHand = this.getCardsByZone(player, 'hand')
  const inHandAspect = inHand
    .filter(card => test(card))
    .length > 0

  if (inHandAspect) {
    this.mLog({
      template: '{player} has matching focus card in hand',
      args: { player },
    })
    fn()
    return
  }

  this.mLog({
    template: 'No card matching focus card',
  })
}

Tyrants.prototype.aWithFocusAspect = function(player, aspect, fn) {
  const test = (card) => card.aspect === aspect
  this.aWithFocus(player, test, fn)
}

Tyrants.prototype.aWithFocusInsaneOutcast = function(player, fn) {
  const test = (card) => card.name === 'Insane Outcast'
  this.aWithFocus(player, test, fn)
}

Tyrants.prototype.getAssassinateChoices = function(player, opts={}) {
  const presence = opts.loc ? [opts.loc] : this.getPresence(player)

  const troops = presence
    .filter(loc => opts.loc ? loc === opts.loc : true)
    .flatMap(loc => loc.getTroops().map(troop => [loc, troop]))
    .filter(([_, troop]) => troop.owner !== player)
    .filter(([_, troop]) => opts.whiteOnly ? troop.owner === undefined : true)
    .map(([loc, troop]) => `${loc.name}, ${troop.getOwnerName()}`)
  const choices = util.array.distinct(troops).sort()
  return choices
}

Tyrants.prototype.getCardById = function(cardId) {
  if (cardId in res.cards.byId) {
    return res.cards.byId[cardId]
  }
  else if (cardId in this.state.tokenLookup) {
    return this.state.tokenLookup[cardId]
  }
  else {
    throw new Error(`Unknown card: ${cardId}`)
  }
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

Tyrants.prototype.getDeployChoices = function(player, opts={}) {
  const base = opts.anywhere ? this.getLocationAll() : this.getPresence(player)
  return base.filter(loc => loc.getTroops().length < loc.size)
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

Tyrants.prototype.getPlayerByCard = function(card) {
  return card.owner
}

Tyrants.prototype.getPlayerFirst = function() {
  return this.getPlayerAll()[0]
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
  return this.getScoreBreakdown(player).total
}

Tyrants.prototype.getScoreBreakdown = function(player) {
  const self = this

  const summary = {
    "deck": [
      ...self.getCardsByZone(player, 'hand'),
      ...self.getCardsByZone(player, 'discard'),
      ...self.getCardsByZone(player, 'deck'),
      ...self.getCardsByZone(player, 'played'),
    ].map(card => card.points)
     .reduce((a, b) => a + b, 0),

    "inner circle": self
      .getCardsByZone(player, 'innerCircle')
      .map(card => card.innerPoints)
      .reduce((a, b) => a + b, 0),

    "trophy hall": self.getCardsByZone(player, 'trophyHall').length,

    "control": self
      .getLocationAll()
      .filter(loc => loc.getController() === player)
      .map(loc => loc.points)
      .reduce((a, b) => a + b, 0),

    "total control": self
      .getLocationAll()
      .filter(loc => loc.getTotalController() === player)
      .length * 2,

    "victory points": player.points
  }

  summary.total = (
    + summary['deck']
    + summary['inner circle']
    + summary['trophy hall']
    + summary['control']
    + summary['total control']
    + summary['victory points']
  )

  return summary
}

Tyrants.prototype.getZoneByHome = function(card) {
  return this.getZoneByCardHome(card)
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

Tyrants.prototype.mAdjustControlMarkerOwnership = function(previous) {
  const markers = this.getControlMarkers()
  for (const marker of markers) {
    const prev = previous.find(p => p.locName === marker.locName)

    if (prev.ownerName !== '' && marker.ownerName === '') {
      const player = this.getPlayerByName(prev.ownerName)
      const loc = this.getLocationByName(marker.locName)

      this.mLog({
        template: '{player} loses the {loc} control marker',
        args: { player, loc }
      })
    }

    else if (prev.ownerName !== marker.ownerName) {
      const player = this.getPlayerByName(marker.ownerName)
      const loc = this.getLocationByName(marker.locName)

      this.mLog({
        template: '{player} claims the {loc} control marker',
        args: { player, loc }
      })

      if (this.getPlayerCurrent() === player && !this._checkDoingSetup()) {
        player.incrementInfluence(marker.influence)
      }
    }

    else if (!prev.total && marker.total) {
      const player = this.getPlayerByName(marker.ownerName)
      const loc = this.getLocationByName(marker.locName)

      this.mLog({
        template: '{player} converts the {loc} control marker to total control',
        args: { player, loc }
      })
    }
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
  return target
}

Tyrants.prototype.mCalculatePresence = function(location) {
  util.assert(location.kind === 'location')

  const relevantTroops = [
    location,
    ...this.getLocationNeighbors(location)
  ]

  const playersByTroop = relevantTroops
    .flatMap(loc => loc.getTroops())
    .map(card => this.getPlayerByCard(card))
    .filter(player => player !== undefined)

  const playersBySpy = location
    .getSpies()
    .map(card => this.getPlayerByCard(card))
    .filter(player => player !== undefined)

  location.presence = util.array.distinct([...playersByTroop, ...playersBySpy])
}

Tyrants.prototype.mCheckZoneLimits = function(zone) {
  if (zone.kind === 'location') {
    util.assert(zone.getTroops().length <= zone.size, `Too many troops in ${zone.id}`)

    const spies = zone.getSpies()
    const uniqueSpies = util.array.distinct(spies.map(spy => spy.owner.name))
    util.assert(spies.length === uniqueSpies.length, `More than one spy per player at ${zone.id}`)
  }
}

Tyrants.prototype.mDeploy = function(player, loc, opts={}) {
  const troop = opts.troop || this.getCardsByZone(player, 'troops')[0]
  this.mMoveCardTo(troop, loc)
  return troop
}

Tyrants.prototype.mDevour = function(card) {
  if (card.name === 'Insane Outcast') {
    this.mMoveCardTo(card, this.getZoneById('outcast'))
  }
  else {
    this.mMoveCardTo(card, this.getZoneById('devoured'))
  }
}

Tyrants.prototype.mExecuteCard = function(player, card) {
  this.mLogIndent()
  card.impl(this, player, { card })
  this.mLogOutdent()
}

Tyrants.prototype.mMoveByIndices = function(source, sourceIndex, target, targetIndex) {
  util.assert(sourceIndex >= 0 && sourceIndex <= source.cards().length - 1, `Invalid source index ${sourceIndex}`)

  const preControlMarkers = this.getControlMarkers()

  const sourceCards = source._cards
  const targetCards = target._cards
  const card = sourceCards[sourceIndex]
  sourceCards.splice(sourceIndex, 1)
  targetCards.splice(targetIndex, 0, card)
  card.zone = target.id
  this.mCheckZoneLimits(target)
  this.mAdjustCardVisibility(card)
  this.mAdjustPresence(source, target, card)
  this.mAdjustControlMarkerOwnership(preControlMarkers)
  return card
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
    template: '{player} will refill their hand',
    args: { player }
  })
  this.mLogIndent()

  const reduceDraw = this.state.reduceDraw[player.name]
  const numberToDraw = 5 - reduceDraw

  if (reduceDraw > 0) {
    this.mLog({
      template: '{player} will draw {count} fewer cards this round',
      args: { player, count: reduceDraw }
    })
    this.state.reduceDraw[player.name] = 0
  }

  const drawnAfterShuffle = Math.min(
    Math.max(0, numberToDraw - deck.cards().length),  // Number of cards left to draw after reshuffling
    this.getCardsByZone(player, 'discard').length  // Number of cards in discard pile
  )

  if (deck.cards().length < numberToDraw) {
    this.mLog({
      template: '{player} draws the remaining {count} cards from deck',
      args: {
        player,
        count: deck.cards().length
      }
    })
  }

  while (hand.cards().length < numberToDraw) {
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

Tyrants.prototype.mRefillMarket = function(quiet=false) {
  const deck = this.getZoneById('marketDeck')
  const market = this.getZoneById('market')
  const count = 6 - market.cards().length

  for (let i = 0; i < count; i++) {
    const card = deck.cards()[0]

    if (!card) {
      this.mLog({ template: 'The market deck is empty' })
      return
    }

    if (!quiet) {
      this.mLog({
        template: '{card} added to the market',
        args: { card }
      })
    }

    this.mMoveCardTo(card, market)
  }
}

Tyrants.prototype.mSetGhostFlag = function() {
  this.state.ghostFlag = true
}

Tyrants.prototype._checkDoingSetup = function() {
  return this.doingSetup
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
