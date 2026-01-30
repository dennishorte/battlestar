const {
  Game,
  GameFactory,
  GameOverEvent,
} = require('./../lib/game.js')
const res = require('./res/index.js')
const util = require('../lib/util.js')

const { TyrantsLogManager } = require('./TyrantsLogManager.js')
const { TyrantsMapZone } = require('./TyrantsMapZone.js')
const { TyrantsToken } = require('./TyrantsToken.js')
const { TyrantsZone } = require('./TyrantsZone.js')


module.exports = {
  GameOverEvent,
  Tyrants,
  TyrantsFactory,

  constructor: Tyrants,
  factory: factoryFromLobby,
  res,
}


function Tyrants(serialized_data, viewerName) {
  Game.call(this, serialized_data, viewerName, {
    LogManager: TyrantsLogManager,
  })
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
    randomizeExpansions: lobby.options.randomizeExpansions,
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
  this.log.add({ template: 'Initializing' })
  this.log.indent()

  this.initializeExpansions()
  this.initializePlayers()
  this.initializeZones()
  this.initializeCards()
  this.initializeTokens()
  this.initializeStartingHands()
  this.initializeTransientState()

  this.log.outdent()

  this.state.ghostFlag = false
  this.state.initializationComplete = true
  this.doingSetup = true
  this._breakpoint('initialization-complete')
  this.doingSetup = false
}

Tyrants.prototype.initializeExpansions = function() {
  if (!this.settings.randomizeExpansions) {
    return
  }

  const allExpansions = ['demons', 'dragons', 'drow', 'elementals', 'illithid', 'undead']

  // Randomly pick 2 expansions using Fisher-Yates partial shuffle
  const shuffled = [...allExpansions]
  for (let i = shuffled.length - 1; i > shuffled.length - 3; i--) {
    const j = Math.floor(this.random() * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = temp
  }

  this.settings.expansions = [shuffled[shuffled.length - 2], shuffled[shuffled.length - 1]].sort()

  this.log.add({
    template: 'Randomly selected expansions: ' + this.settings.expansions.join(', '),
  })
}

Tyrants.prototype.initializeZones = function() {
  this.initializeMapZones()
  this.initializeMarketZones()
  this.initializePlayerZones()
  this.initializeTokenZones()

  this.zones.register(new TyrantsZone(this, 'devoured', 'devoured', 'public'))
}

Tyrants.prototype.initializePlayers = function() {
  for (const player of this.players.all()) {
    player.addCounter('points')
    player.addCounter('influence')
    player.addCounter('power')
    player.addCounter('reduce-draw')
  }
}

Tyrants.prototype.initializeMapZones = function() {
  for (const data of res.maps[this.settings.map]) {
    const zone = new TyrantsMapZone(this, data)
    this.zones.register(zone)
  }
}

Tyrants.prototype.initializeMarketZones = function() {
  this.zones.register(new TyrantsZone(this, 'market', 'market', 'public'))
  this.zones.register(new TyrantsZone(this, 'priestess', 'priestess', 'public'))
  this.zones.register(new TyrantsZone(this, 'guard', 'guard', 'public'))
  this.zones.register(new TyrantsZone(this, 'outcast', 'outcast', 'public'))
}

Tyrants.prototype.initializeTokenZones = function() {
  this.zones.register(new TyrantsZone(this, 'neutrals', 'neutrals', 'public'))
}

Tyrants.prototype.initializePlayerZones = function() {
  const self = this

  function _addPlayerZone(player, name, kind) {
    const id = `players.${player.name}.${name}`
    const zone = new TyrantsZone(self, id, id, kind, player)
    self.zones.register(zone)
  }

  for (const player of this.players.all()) {
    _addPlayerZone(player, 'deck', 'hidden')
    _addPlayerZone(player, 'played', 'public')
    _addPlayerZone(player, 'discard', 'public')
    _addPlayerZone(player, 'trophyHall', 'public')
    _addPlayerZone(player, 'hand', 'private')
    _addPlayerZone(player, 'innerCircle', 'public')

    _addPlayerZone(player, 'troops', 'public')
    _addPlayerZone(player, 'spies', 'public')
  }
}

Tyrants.prototype.initializeCards = function() {
  const expansions = this.getExpansionList()

  this.log.add({ template: 'Loading expansion: ' + expansions[0] })
  this.log.add({ template: 'Loading expansion: ' + expansions[1] })

  const cardData = res.cards.factory(this)
  cardData.all.forEach(card => this.cards.register(card))

  this.zones.byId('priestess').initializeCards(cardData.byName['Priestess of Lolth'])
  this.zones.byId('guard').initializeCards(cardData.byName['House Guard'])
  this.zones.byId('outcast').initializeCards(cardData.byName['Insane Outcast'])

  // Market deck
  const marketZone = new TyrantsZone(this, 'marketDeck', 'marketDeck', 'private')
  this.zones.register(marketZone)

  const marketCards = this
    .getExpansionList()
    .flatMap(exp => cardData.byExpansion[exp])
  marketZone.initializeCards(marketCards)
  marketZone.shuffle()

  // Market cards
  this.log.add({ template: 'Adding starting market cards' })
  this.log.indent()
  this.mRefillMarket(true)
  this.log.outdent()

  // Starter decks
  let x = 0
  let y = 0
  for (const player of this.players.all()) {
    const cards = []

    for (let i = 0; i < 7; i++) {
      const card = cardData.byName['Noble'][x]
      cards.push(card)
      x += 1
    }

    for (let i = 0; i < 3; i++) {
      const card = cardData.byName['Soldier'][y]
      cards.push(card)
      y += 1
    }

    const deck = this.zones.byPlayer(player, 'deck')
    deck.initializeCards(cards)
    deck.shuffle()
  }
}

Tyrants.prototype.initializeTokens = function() {
  for (const player of this.players.all()) {
    const troops = []
    for (let i = 0; i < 40; i++) {
      const name = `troop-${player.name}`
      const token = new TyrantsToken(this, name + '-' + i, name)
      this.cards.register(token)
      token.isTroop = true
      token.owner = player
      troops.push(token)
    }
    this.zones.byPlayer(player, 'troops').initializeCards(troops)

    const spies = []
    for (let i = 0; i < 5; i++) {
      const name = `spy-${player.name}`
      const token = new TyrantsToken(this, name + '-' + i, name)
      this.cards.register(token)
      token.isSpy = true
      token.owner = player
      spies.push(token)
    }
    this.zones.byPlayer(player, 'spies').initializeCards(spies)
  }

  // Neutrals
  const neutrals = []
  for (let i = 0; i < 80; i++) {
    const token = new TyrantsToken(this, 'neutral-' + i, 'neutral')
    this.cards.register(token)
    token.isTroop = true
    neutrals.push(token)
  }
  this.zones.byId('neutrals').initializeCards(neutrals)


  // Place neutrals on map
  const neutralZone = this.zones.byId('neutrals')
  for (const loc of this.getLocationAll()) {
    for (let i = 0; i < loc.neutrals; i++) {
      neutralZone.peek().moveTo(loc)
    }
  }

  if (this.settings.menzoExtraNeutral) {
    const menzo = this.getLocationByName('Menzoberranzan')
    neutralZone.peek().moveTo(menzo)
  }
}

Tyrants.prototype.initializeStartingHands = function() {
  for (const player of this.players.all()) {
    this.mRefillHand(player)
  }
}

Tyrants.prototype.initializeTransientState = function() {
  this.state.turn = 0
  this.state.endOfTurnActions = []
}

Tyrants.prototype.chooseInitialLocations = function() {
  this.log.add({ template: 'Choosing starting locations' })
  this.log.indent()

  for (const player of this.players.all()) {
    this.aChooseColor(player)

    const choices = this
      .getLocationAll()
      .filter(loc => loc.start)
      .filter(loc => loc.getTroops().filter(t => t.name !== 'neutral').length === 0)

    const loc = this.aChooseLocation(player, choices, { title: 'Choose starting location' })
    this.aDeploy(player, loc)
  }

  this.log.outdent()
}


////////////////////////////////////////////////////////////////////////////////
// Main Loop

Tyrants.prototype.mainLoop = function() {
  while (true) {
    this.log.setIndent(0)
    this.log.add({
      template: '{player} turn {count}',
      args: {
        player: this.players.current(),
        count: this.getRound(),
      },
      classes: ['player-turn'],
    })

    this.log.indent()

    this.preActions()
    this.doActions()

    this.log.indent()
    this.endOfTurn()
    this.cleanup()

    this.drawHand()
    this.nextPlayer()
    this.checkForEndOfGame()
  }
}

Tyrants.prototype.preActions = function() {
  const player = this.players.current()

  // Gain influence from site control tokens.
  const markers = this.getControlMarkers(player)
  for (const marker of markers) {
    const loc = this.getLocationByName(marker.locName)
    player.incrementCounter('influence', marker.influence, { silent: true })
    this.log.add({
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
  const player = this.players.current()

  while (true) {
    const chosenAction = this.requestInputSingle({
      actor: player.name,
      title: `Choose Action`,
      choices: this._generateActionChoices(),
    })[0]

    if (chosenAction === 'Pass') {
      this.log.add({
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

    else if (chosenAction.action === 'assassinate-with-power') {
      this.log.add({
        template: '{player} power: Assassinate a Troop',
        args: { player }
      })
      this.log.indent()
      const loc = this.getLocationByName(chosenAction.location)
      const owner = chosenAction.owner === 'neutral' ? 'neutral' : this.players.byName(chosenAction.owner)
      this.aAssassinate(player, loc, owner)
      player.incrementCounter('power', -3)
      this.log.outdent()
      continue
    }

    else if (chosenAction.action === 'return-spy-with-power') {
      this.log.add({
        template: '{player} power: Return an Enemy Spy',
        args: { player }
      })
      this.log.indent()
      const loc = this.getLocationByName(chosenAction.location)
      const owner = this.players.byName(chosenAction.owner)
      this.aReturnSpy(player, loc, owner)
      player.incrementCounter('power', -3)
      this.log.outdent()
      continue
    }

    const name = chosenAction.title
    const arg = chosenAction.selection[0]

    if (name === 'Play Card') {
      const card = this
        .cards.byPlayer(player, 'hand')
        .find(c => c.name === arg)
      this.aPlayCard(player, card)
      continue
    }
    else if (name === 'Recruit') {
      this.log.add({
        template: '{player} recruit',
        args: { player }
      })
      this.log.indent()
      this.aRecruit(player, arg)
      this.log.outdent()
      continue
    }
    else if (name === 'Use Power') {
      if (arg === 'Deploy a Troop') {
        this.aDeployWithPowerAt(player)
        continue
      }

      else if (arg === 'Assassinate a Troop') {
        this.log.add({
          template: '{player} power: Assassinate a Troop',
          args: { player }
        })
        this.log.indent()
        this.aChooseAndAssassinate(player)
        player.incrementCounter('power', -3)
        this.log.outdent()
        continue
      }

      else if (arg === 'Return an Enemy Spy') {
        this.log.add({
          template: '{player} power: Return an Enemy Spy',
          args: { player }
        })
        this.log.indent()
        this.aChooseAndReturn(player, { noTroops: true })
        player.incrementCounter('power', -3)
        this.log.outdent()
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
  return choices.filter(action => Boolean(action))
}

Tyrants.prototype._generateCardActions = function() {
  const choices = []
  for (const card of this.cards.byPlayer(this.players.current(), 'hand')) {
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
  const player = this.players.current()
  const cards = this.cards.byPlayer(player, 'hand')

  if (cards.some(card => card.autoplay)) {
    return 'Auto-play Cards'
  }
  else {
    return undefined
  }
}

Tyrants.prototype._generateBuyActions = function(maxCost=0, opts={}) {
  const choices = []

  const priestess = this.zones.byId('priestess').peek()
  if (priestess) {
    choices.push({ card: priestess })
  }

  const guard = this.zones.byId('guard').peek()
  if (guard) {
    choices.push({ card: guard })
  }

  const market = this
    .zones.byId('market')
    .cardlist()
    .sort((l, r) => l.name.localeCompare(r.name))
    .sort((l, r) => l.cost - r.cost)
  for (const card of market) {
    choices.push({ card })
  }

  if (this.state.ghostFlag) {
    const devoured = this.zones.byId('devoured').cardlist().slice(-1)[0]
    if (devoured) {
      choices.push({
        card: devoured,
        devoured: true,
      })
    }
  }

  const influence = maxCost ? maxCost : this.players.current().getCounter('influence')
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
  const player = this.players.current()
  const choices = []

  const power = player.getCounter('power')
  if (
    power >= 1
    && this.cards.byPlayer(player, 'troops').length > 0
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
      this.log.add({
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
      this.log.add({
        template: '{player} may promote a card with aspect {aspect}',
        args: {
          player: action.player,
          aspect: action.aspect,
        }
      })
      const choices = this
        .cards.byPlayer(action.player, 'played')
        .filter(card => card.aspect === action.aspect)
        .sort(card => card.name)
      this.aChooseAndPromote(action.player, choices, { min: 1, max: 1 })
    }

    else if (action.action === 'promote-special') {
      if (action.source.name === 'High Priest of Myrkul') {
        this.log.add({
          template: '{player} may promote any number of undead cards',
          args: { player: action.player }
        })
        const choices = this
          .cards.byPlayer(action.player, 'played')
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
      .cards.byPlayer(promo.player, 'played')
      .filter(card => card !== promo.source)
      .forEach(card => util.array.pushUnique(promoChoices, card))
  }

  if (promoChoices.length > 0) {
    const player = this.players.current()

    const max = promos.length
    const min = promos.filter(p => !p.opts.optional).length

    this.log.add({
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
  const player = this.players.current()

  const markers = this.getControlMarkers(player)
  for (const marker of markers) {
    if (marker.total && marker.points) {
      player.incrementCounter('points', marker.points, { silent: true })
      this.log.add({
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
  const player = this.players.current()
  const playedCards = this.cards.byPlayer(player, 'played')

  this.log.add({
    template: '{player} moves {count} played cards to discard pile.',
    args: {
      player,
      count: playedCards.length
    }
  })

  for (const card of playedCards) {
    card.moveTo(this.zones.byPlayer(player, 'discard'))
  }

  const hand = this.cards.byPlayer(player, 'hand')
  if (hand.length > 0) {
    this.log.add({
      template: '{player} discards {count} remaining cards',
      args: { player, count: hand.length }
    })
    for (const card of hand) {
      card.moveTo(this.zones.byPlayer(player, 'discard'))
    }
  }

  // Clear remaining influence and power
  player.setCounter('power', 0)
  player.setCounter('influence', 0)

  this.checkForEndGameTriggers()
}

Tyrants.prototype.checkForEndGameTriggers = function() {

  // Any player has zero troops left
  for (const player of this.players.all()) {
    if (this.cards.byPlayer(player, 'troops').length === 0) {
      this.log.add({
        template: '{player} has deployed all of their troops',
        args: { player }
      })
      this.state.endGameTriggered = true
    }
  }

  // The market is depleted
  if (this.zones.byId('marketDeck').cardlist().length === 0) {
    this.log.add({
      template: 'The market is depleted'
    })
    this.state.endGameTriggered = true
  }

  if (this.state.endGameTriggered) {
    this.log.add({
      template: "The end of the game has been triggered. The game will end at the start of {player}'s next turn.",
      args: { player: this.players.first() }
    })
  }
}

Tyrants.prototype.drawHand = function() {
  this.mRefillHand(this.players.current())
}

Tyrants.prototype.nextPlayer = function() {
  this.players.advancePlayer()
  this.state.turn += 1
}

Tyrants.prototype.checkForEndOfGame = function() {
  if (this.state.endGameTriggered && this.players.current() === this.players.first()) {

    const scores = this
      .players
      .all()
      .map(player => ({
        player,
        score: this.getScore(player)
      }))
      .sort((l, r) => r.score - l.score)

    for (const score of scores) {
      this.log.add({
        template: '{player}: {score}',
        args: {
          player: score.player,
          score: score.score
        }
      })
    }

    if (scores[0].score === scores[1].score) {
      this.log.add({
        template: 'Multiple players are tied for the highest score. There is no tie breaker, so they share the victory.'
      })
      throw new GameOverEvent({
        player: 'All players with the highest score',
        reason: 'Points are tied',
      })
    }

    else {
      throw new GameOverEvent({
        player: scores[0].player.name,
        reason: 'ALL THE POINTS!'
      })
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Alt Actions

Tyrants.prototype.aDeployWithPowerAt = function(player, locId=null) {
  this.log.add({
    template: '{player} power: Deploy a Troop',
    args: { player }
  })
  this.log.indent()

  if (locId) {
    const loc = this.getLocationByName(locId)
    this.aDeploy(player, loc)
  }
  else {
    this.aChooseAndDeploy(player)
  }

  player.incrementCounter('power', -1)
  this.log.outdent()
}


////////////////////////////////////////////////////////////////////////////////
// Core Functionality

Tyrants.prototype.aCascade = function(player, opts) {
  const marketZone = this.zones.byId('marketDeck')

  const unused = []
  let found = null

  for (const card of marketZone.cardlist()) {
    if (card[opts.key] === opts.value && card.cost <= opts.maxCost) {
      found = card
      break
    }
    else {
      this.log.add({
        template: 'skipping {card}',
        args: { card }
      })
      unused.push(card)
    }
  }

  for (const card of unused) {
    card.moveTo(marketZone)
  }

  if (found) {
    this.log.add({
      template: '{card} found',
      args: { card: found }
    })
    found.moveTo(this.zones.byPlayer(player, 'hand'))
    this.aPlayCard(player, found)

    // If the player devoured the card as part of using it, they cannot acquire it.
    if (found.zone.id === 'devoured') {
      this.log.add({
        template: '{card} cannot be acquired because it was devoured',
        args: { card: found }
      })
      return
    }

    if (this.actions.chooseYesNo(player, 'Acquire ' + found.name + '?')) {
      this.log.add({
        template: '{player} adds {card} to their deck',
        args: { player, card: found }
      })
      found.moveTo(this.zones.byPlayer(player, 'discard'))
    }
    else {
      this.aDevour(player, found)
    }
  }
  else {
    this.log.add({ template: 'No cards found' })
  }
}

Tyrants.prototype.aChooseColor = function(player) {
  // This option exists so that games in progress when color selection is introduced don't break
  if (!this.settings.chooseColors) {
    return
  }

  const availableColors = Object.entries(res.colors)
    .filter(([, hex]) => !this.players.all().some(p => p.color === hex))
    .map(([name]) => name)

  const chosen = this.actions.choose(player, availableColors, {
    title: 'Choose a player color',
  })
  player.color = res.colors[chosen]
}

Tyrants.prototype.aChooseLocation = function(player, locations, opts={}) {
  const choices = locations
    .map(loc => loc.name())
    .sort()

  if (!opts.title) {
    opts.title = 'Choose a location'
  }

  const selection = this.actions.choose(player, choices, opts)
  if (selection.length > 0) {
    return locations.find(loc => loc.name() === selection[0])
  }
}

Tyrants.prototype.aChooseAndAssassinate = function(player, opts={}) {
  const choices = this.getAssassinateChoices(player, opts)
  const selection = this.actions.choose(player, choices)
  if (selection.length > 0) {
    const [locName, ownerName] = selection[0].split(', ')
    const loc = this.getLocationByName(locName)
    const owner = ownerName === 'neutral' ? 'neutral' : this.players.byName(ownerName)
    return this.aAssassinate(player, loc, owner)
  }
}

Tyrants.prototype.aChooseAndDevour = function(player, opts={}) {
  const zoneName = opts.zone ? opts.zone : 'hand'
  const chosen = this.actions.chooseCard(player, this.cards.byPlayer(player, zoneName), {
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
    this.log.add({
      template: '{player} choose not to devour a card',
      args: { player },
    })
  }
}

Tyrants.prototype.aChooseAndDevourMarket = function(player, opts={}) {
  const chosen = this.actions.chooseCards(player, this.zones.byId('market').cardlist(), {
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
    this.log.add({
      template: '{player} choose not to devour a card in the market',
      args: { player },
    })
  }
}

Tyrants.prototype.aChooseAndDiscard = function(player, opts={}) {
  if (opts.requireThree) {
    const cardsInHand = this.cards.byPlayer(player, 'hand').length
    if (cardsInHand <= 3) {
      this.log.add({
        template: '{player} has only {count} cards in hand, so does not discard',
        args: { player, count: cardsInHand }
      })
      return
    }
  }

  this.log.add({
    template: '{player} must discard a card',
    args: { player }
  })
  this.log.indent()

  if (!opts.title) {
    opts.title = 'Choose a card to discard'
  }

  const chosen = this.actions.chooseCard(player, this.cards.byPlayer(player, 'hand'), opts)
  if (chosen) {
    // Some cards have triggers if an opponent causes you to discard.
    if (opts.forced) {
      const triggers = chosen.triggers || []
      for (const trigger of triggers) {
        if (trigger.kind === 'discard-this') {
          const result = trigger.impl(this, player, { card: chosen, forcedBy: opts.forcedBy })
          this.log.outdent()
          return result
        }
      }
    }

    // Only get to this on fall-through
    this.aDiscard(player, chosen)
    this.log.outdent()
    return chosen
  }
  else {
    this.log.add({
      template: '{player} cannot or chooses not to discard',
      args: { player }
    })
  }

  this.log.outdent()
}

Tyrants.prototype.aChooseAndSupplant = function(player, opts={}) {
  const troops = this.cards.byPlayer(player, 'troops')
  if (troops.length === 0) {
    this.log.add({
      template: '{player} has no more troops',
      args: { player }
    })
    return
  }

  const choices = this._collectTargets(player, opts).troops
  const selection = this.actions.choose(player, choices)
  if (selection.length > 0) {
    const [locName, ownerName] = selection[0].split(', ')
    const loc = this.getLocationByName(locName)
    const owner = ownerName === 'neutral' ? 'neutral' : this.players.byName(ownerName)
    this.aSupplant(player, loc, owner)
  }
}

Tyrants.prototype.aChooseAndDeploy = function(player, opts={}) {
  // If the player is deploying a white troop, fetch it from the bank.
  if (opts.white) {
    const white = this.zones.byId('neutrals').peek()
    if (!white) {
      this.log.add({ template: 'There are no neutral troops left in the supply' })
      return
    }
    opts.troop = white
  }

  // Ensure there are troops to be deployed
  const troops = this.cards.byPlayer(player, 'troops')
  if (troops.length === 0 && !opts.troop) {
    this.log.add({
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
  const toMove = this.actions.choose(player, choices, { title: "Choose a troop to move" })[0]
  if (toMove) {
    const [locName, ownerName] = toMove.split(', ')
    const source = this.getLocationByName(locName)
    const owner = ownerName === 'neutral' ? 'neutral' : this.players.byName(ownerName)
    const troop = source.getTroops(owner)[0]

    const destChoices = this
      .getLocationAll()
      .filter(loc => loc.checkHasOpenTroopSpace())
      .filter(loc => loc !== source)

    const dest = this.aChooseLocation(player, destChoices)

    if (!dest) {
      this.log.add({ template: 'No valid targets for moving a troop' })
      return
    }

    util.assert(!!troop, `Invalid selection for moving a troop: ${toMove}`)

    troop.moveTo(dest)
    this.log.add({
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
  if (this.cards.byPlayer(player, 'spies').length === 0) {
    this.log.add({
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
  const choiceObjects = cardsToChoose
    .map(c => ({
      title: c.name,
      subtitles: [`${c.points} / ${c.innerPoints}`],
    }))
    .sort((a, b) => a.title.localeCompare(b.title))

  const choices = this.actions.choose(player, choiceObjects, { ...opts, title: 'Choose cards to promote' })

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
    const cardNames = this.actions.choose(player, choices.choices, { ...opts, title: 'Choose cards to recruit' })
    for (const name of cardNames) {
      this.aRecruit(player, name, { noCost: true })
    }
  }
  else {
    this.log.add({ template: 'Not able to recruit any cards' })
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
    .filter(([, troop]) => troop.owner !== player)
    .filter(([, troop]) => opts.whiteOnly ? !troop.owner : true)
    .filter(([, troop]) => opts.noWhite ? !!troop.owner : true)
    .map(([loc, troop]) => `${loc.name()}, ${troop.getOwnerName()}`)

  const spies = baseLocations
    .flatMap(loc => loc.getSpies().map(spy => [loc, spy]))
    .filter(([, spy]) => spy.owner !== player)
    .map(([loc, spy]) => `${loc.name()}, ${spy.getOwnerName()}`)

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

  const selection = this.actions.choose(player, choices, {
    title: 'Choose a token to return',
  })

  if (selection.length > 0) {
    const kind = selection[0].title
    const [locName, ownerName] = selection[0].selection[0].split(', ')
    const loc = this.getLocationByName(locName)
    const owner = ownerName === 'neutral' ? 'neutral' : this.players.byName(ownerName)

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
  const selection = this.actions.choose(player, choices.map(c => c.title))[0]
  const impl = choices.find(c => c.title === selection).impl

  this.log.add({
    template: '{player} chooses {selection}',
    args: { player, selection }
  })
  impl(this, player, opts)
}

Tyrants.prototype.aChooseToDiscard = function(player) {
  const opponents = this
    .players.opponents(player)
    .filter(p => this.cards.byPlayer(p, 'hand').length > 3)
    .map(p => p.name)

  const choice = this.actions.choose(player, opponents, { title: 'Choose an opponent to discard' })
  if (choice.length > 0) {
    const opponent = this.players.byName(choice[0])
    this.aChooseAndDiscard(opponent, { forced: true, forcedBy: player.name })
  }
  else {
    this.log.add({
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
  const player = this.players.current()
  const cards = this.cards.byPlayer(player, 'hand')
  for (const card of cards) {
    if (card.autoplay) {
      this.aPlayCard(player, card)
    }
  }
}

Tyrants.prototype.aAssassinate = function(player, loc, owner) {
  const troop = this.mAssassinate(player, loc, owner)
  this.log.add({
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
  this.log.add({
    template: '{player} deploys {card} to {loc}',
    args: { player, loc, card: deployed }
  })
}

Tyrants.prototype.aDevour = function(player, card, opts={}) {
  this.log.add({
    template: '{player} devours {card} from {zone}',
    args: { player, card, zone: card.zone },
  })
  this.mDevour(card)

  if (!opts.noRefill) {
    this.mRefillMarket()
  }
}

Tyrants.prototype.aDevourThisAnd = function(player, card, title, fn) {
  this.log.add({
    template: `{player} may activate '${title}'`,
    args: { player }
  })
  this.log.indent()
  const doDevour = this.actions.chooseYesNo(player, title)
  if (doDevour) {
    this.aDevour(player, card)
    fn(this, player)
  }
  else {
    this.log.addDoNothing(player, 'devour')
  }
  this.log.outdent()
}

Tyrants.prototype.aDiscard = function(player, card) {
  card.moveTo(this.zones.byPlayer(player, 'discard'))
  this.log.add({
    template: '{player} discards {card}',
    args: { player, card }
  })
}

Tyrants.prototype.aDraw = function(player, opts={}) {
  const deck = this.zones.byPlayer(player, 'deck')
  const hand = this.zones.byPlayer(player, 'hand')

  if (deck.cardlist().length === 0) {
    // See if we can reshuffle.
    const discard = this.zones.byPlayer(player, 'discard')
    if (discard.cardlist().length > 0) {
      this.mReshuffleDiscard(player)
    }

    // If not, do nothing.
    else {
      return 'no-more-cards'
    }
  }

  if (!opts.silent) {
    this.log.add({
      template: '{player} draws a card',
      args: { player }
    })
  }
  return deck.peek().moveTo(hand)
}


Tyrants.prototype.aPlaceSpy = function(player, loc) {
  this.mPlaceSpy(player, loc)
  this.log.add({
    template: '{player} places a spy at {loc}',
    args: { player, loc }
  })
}

Tyrants.prototype.aPlayCard = function(player, card) {
  // There are several cases where a card not owned by the player is played, such as
  // Ulitharid and undead cascade.
//  util.assert(card.owner === player, 'Card is not owned by player')
  util.assert(card.zone.id.endsWith('hand'), 'Card is not in player hand')

  card.moveTo(this.zones.byPlayer(player, 'played'))
  this.log.add({
    template: '{player} plays {card}',
    args: { player, card }
  })

  this.mExecuteCard(player, card)
}

Tyrants.prototype.aPromote = function(player, card, opts={}) {
  if (card.name === 'Insane Outcast') {
    card.moveTo(this.zones.byId('outcast'))
  }
  else {
    card.moveTo(this.zones.byPlayer(player, 'innerCircle'))
  }

  if (!opts.silent) {
    this.log.add({
      template: '{player} promotes {card}',
      args: { player, card }
    })
  }
  return card
}

Tyrants.prototype.aPromoteTopCard = function(player) {
  const deck = this.zones.byPlayer(player, 'deck')

  if (deck.cardlist().length === 0) {
    // See if we can reshuffle.
    const discard = this.zones.byPlayer(player, 'discard')
    if (discard.cardlist().length > 0) {
      this.mReshuffleDiscard(player)
    }

    // If not, do nothing.
    else {
      this.log.add({
        template: '{player} has no cards in deck or discard pile',
        args: { player }
      })
      return
    }
  }

  this.log.add({ template: 'Promoting top card of deck' })
  this.log.indent()
  this.aPromote(player, deck.peek())
  this.log.outdent()
}

Tyrants.prototype.aRecruit = function(player, cardName, opts={}) {
  let card

  if (cardName.startsWith('devoured: ')) {
    card = this.zones.byId('devoured').cardlist().slice(-1)[0]
  }
  else if (cardName === 'Priestess of Lolth') {
    card = this.zones.byId('priestess').peek()
  }
  else if (cardName === 'House Guard') {
    card = this.zones.byId('guard').peek()
  }
  else if (cardName === 'Insane Outcast') {
    card = this.zones.byId('outcast').peek()

    if (!card) {
      this.log.indent()
      this.log.add({ template: 'No more insane outcasts remaining' })
      this.log.outdent()
      return
    }
  }
  else {
    const market = this.zones.byId('market').cardlist()
    card = market.find(c => c.name === cardName)
  }

  util.assert(!!card, `Unable to find card to recruit: ${cardName}`)

  card.moveTo(this.zones.byPlayer(player, 'discard'))

  if (!opts.noCost) {
    player.incrementCounter('influence', -card.cost)
  }

  this.log.add({
    template: '{player} recruits {card}',
    args: { player, card }
  })

  this.mRefillMarket()
}

// Player will draw one less card the next time they refill their hand.
Tyrants.prototype.aReduceDraw = function(player) {
  player.incrementCounter('reduce-draw')
}

Tyrants.prototype.aReturnSpy = function(player, loc, owner) {
  const spy = loc.getSpies(owner, loc)[0]
  util.assert(!!spy, `No spy belonging to ${owner.name} at ${loc.name()}`)
  this.mReturn(spy)
  this.log.add({
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
    this.log.add({
      template: '{player} has no spies to return',
      args: { player }
    })
  }

  const loc = this.aChooseLocation(player, locations, { min: 0, max: 1 })

  // If a spy was returned, execute fn
  if (loc) {
    const spy = loc.getSpies(player)[0]

    this.log.add({
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
    this.log.add({
      template: '{player} chooses not to return a spy',
      args: { player }
    })
  }
}

Tyrants.prototype.aReturnTroop = function(player, loc, owner) {
  const troop = loc.getTroops(owner, loc)[0]
  util.assert(!!troop, `No troop belonging to ${owner.name} at ${loc.name()}`)
  this.log.add({
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

  this.log.add({
    template: '{player1} supplants {player2} troop at {loc}',
    args: {
      player1: player,
      player2: owner,
      loc
    }
  })
}

Tyrants.prototype.aWithFocus = function(player, test, fn) {
  const played = this.cards.byPlayer(player, 'played')
  const playedAspect = played
    .filter(card => test(card))
    .length > 1

  if (playedAspect) {
    this.log.add({
      template: '{player} has already played a matching focus card',
      args: { player }
    })
    fn()
    return
  }

  const inHand = this.cards.byPlayer(player, 'hand')
  const inHandAspect = inHand
    .filter(card => test(card))
    .length > 0

  if (inHandAspect) {
    this.log.add({
      template: '{player} has matching focus card in hand',
      args: { player },
    })
    fn()
    return
  }

  this.log.add({
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
    .filter(([, troop]) => troop.owner !== player)
    .filter(([, troop]) => opts.whiteOnly ? !troop.owner : true)
    .map(([loc, troop]) => `${loc.name()}, ${troop.getOwnerName()}`)
  const choices = util.array.distinct(troops).sort()
  return choices
}

Tyrants.prototype.getCardById = function(cardId) {
  // TODO: deprecate
  return this.cards.byId(cardId)
}

Tyrants.prototype.getControlMarkers = function(player) {
  const markers = this
    .getLocationAll()
    .map(loc => loc.getControlMarker())
    .filter(marker => Boolean(marker))

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
  return this.zones.all().filter(z => z.id.startsWith('map.'))
}

Tyrants.prototype.getLocationNeighbors = function(loc) {
  return loc
    .neighborNames
    .map(name => this.getLocationByName(name))
    .filter(neighbor => Boolean(neighbor))
}

Tyrants.prototype.getLocationByName = function(name) {
  // TODO: deprecate
  const id = `map.${name}`
  return this.zones.byId(id)
}

Tyrants.prototype.getLocationsByPresence = function(player) {
  return this
    .getLocationAll()
    .filter(loc => loc.chechHasPresence(player))
}

Tyrants.prototype.getPresence = function(player) {
  return this
    .getLocationAll()
    .filter(loc => loc.presence.includes(player))
}

Tyrants.prototype.getRound = function() {
  return Math.floor(this.state.turn / this.players.all().length) + 1
}

Tyrants.prototype.getScore = function(player) {
  return this.getScoreBreakdown(player).total
}

Tyrants.prototype.getScoreBreakdown = function(player) {
  const self = this

  const summary = {
    "deck": [
      ...self.cards.byPlayer(player, 'hand'),
      ...self.cards.byPlayer(player, 'discard'),
      ...self.cards.byPlayer(player, 'deck'),
      ...self.cards.byPlayer(player, 'played'),
    ].map(card => card.points)
      .reduce((a, b) => a + b, 0),

    "inner circle": self
      .cards.byPlayer(player, 'innerCircle')
      .map(card => card.innerPoints)
      .reduce((a, b) => a + b, 0),

    "trophy hall": self.cards.byPlayer(player, 'trophyHall').length,

    "control": self
      .getLocationAll()
      .filter(loc => loc.getController() === player)
      .map(loc => loc.points)
      .reduce((a, b) => a + b, 0),

    "total control": self
      .getLocationAll()
      .filter(loc => loc.getTotalController() === player)
      .length * 2,

    "victory points": player.getCounter('points')
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

Tyrants.prototype.mAdjustCardVisibility = function(card) {
  if (!this.state.initializationComplete) {
    return
  }

  const zone = card.zone

  // Forget everything about a card if it is returned.
  if (zone.kind() === 'hidden') {
    card.visibility = []
  }

  else if (zone.kind() === 'public' || zone.kind() === 'location') {
    card.visibility = this.players.all()
  }

  else if (zone.kind() === 'private') {
    util.array.pushUnique(card.visibility, zone.owner)
  }

  else {
    throw new Error(`Unknown zone kind ${zone.kind()} for zone ${zone.id}`)
  }
}

Tyrants.prototype.mAdjustControlMarkerOwnership = function(previous) {
  const markers = this.getControlMarkers()
  for (const marker of markers) {
    const prev = previous.find(p => p.locName === marker.locName)

    if (prev.ownerName !== '' && marker.ownerName === '') {
      const player = this.players.byName(prev.ownerName)
      const loc = this.getLocationByName(marker.locName)

      this.log.add({
        template: '{player} loses the {loc} control marker',
        args: { player, loc }
      })
    }

    else if (prev.ownerName !== marker.ownerName) {
      const player = this.players.byName(marker.ownerName)
      const loc = this.getLocationByName(marker.locName)

      this.log.add({
        template: '{player} claims the {loc} control marker',
        args: { player, loc }
      })

      if (this.players.current() === player && !this._checkDoingSetup()) {
        player.incrementCounter('influence', marker.influence)
      }
    }

    else if (!prev.total && marker.total) {
      const player = this.players.byName(marker.ownerName)
      const loc = this.getLocationByName(marker.locName)

      this.log.add({
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
      if (zone.kind() === 'location') {
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

  target.moveTo(this.zones.byPlayer(player, 'trophyHall'))
  return target
}

Tyrants.prototype.mCalculatePresence = function(location) {
  util.assert(location.kind() === 'location')

  const relevantTroops = [
    location,
    ...this.getLocationNeighbors(location)
  ]

  const playersByTroop = relevantTroops
    .flatMap(loc => loc.getTroops())
    .map(card => this.players.byOwner(card))
    .filter(player => Boolean(player))

  const playersBySpy = location
    .getSpies()
    .map(card => this.players.byOwner(card))
    .filter(player => Boolean(player))

  location.presence = util.array.distinct([...playersByTroop, ...playersBySpy])
}

Tyrants.prototype.mCheckZoneLimits = function(zone) {
  if (zone.kind() === 'location') {
    util.assert(zone.getTroops().length <= zone.size, `Too many troops in ${zone.id}`)

    const spies = zone.getSpies()
    const uniqueSpies = util.array.distinct(spies.map(spy => spy.owner.name))
    util.assert(spies.length === uniqueSpies.length, `More than one spy per player at ${zone.id}`)
  }
}

Tyrants.prototype.mDeploy = function(player, loc, opts={}) {
  const troop = opts.troop || this.cards.byPlayer(player, 'troops')[0]
  troop.moveTo(loc)
  return troop
}

Tyrants.prototype.mDevour = function(card) {
  if (card.name === 'Insane Outcast') {
    card.moveTo(this.zones.byId('outcast'))
  }
  else {
    card.moveTo(this.zones.byId('devoured'))
  }
}

Tyrants.prototype.mExecuteCard = function(player, card) {
  this.log.indent()
  card.impl(this, player, { card })
  this.log.outdent()
}

Tyrants.prototype.mPlaceSpy = function(player, loc) {
  const spy = this.cards.byPlayer(player, 'spies')[0]
  spy.moveTo(loc)
}

Tyrants.prototype.mReshuffleDiscard = function(player) {
  const discard = this.zones.byPlayer(player, 'discard')
  const deck = this.zones.byPlayer(player, 'deck')

  util.assert(discard.cardlist().length > 0, 'Cannot reshuffle empty discard.')
  util.assert(deck.cardlist().length === 0, 'Cannot reshuffle discard when deck is not empty.')

  this.log.add({
    template: '{player} shuffles their discard into their deck',
    args: { player }
  })
  this.log.indent()
  this.log.add({
    template: '{count} cards reshuffled',
    args: {
      count: discard.cardlist().length
    }
  })
  this.log.outdent()

  for (const card of discard.cardlist()) {
    card.moveTo(deck)
  }

  this.mShuffle(deck)
}

Tyrants.prototype.mReturn = function(item) {
  item.moveTo(item.home)
}

Tyrants.prototype.mShuffle = function(zone) {
  util.array.shuffle(zone._cards, this.random)
}

Tyrants.prototype.mRefillHand = function(player) {
  const deck = this.zones.byPlayer(player, 'deck')
  const hand = this.zones.byPlayer(player, 'hand')

  this.log.add({
    template: '{player} will refill their hand',
    args: { player }
  })
  this.log.indent()

  const reduceDraw = player.getCounter('reduce-draw')
  const numberToDraw = 5 - reduceDraw

  if (reduceDraw > 0) {
    this.log.add({
      template: '{player} will draw {count} fewer cards this round',
      args: { player, count: reduceDraw }
    })
    player.setCounter('reduce-draw', 0)
  }

  const drawnAfterShuffle = Math.min(
    Math.max(0, numberToDraw - deck.cardlist().length),  // Number of cards left to draw after reshuffling
    this.cards.byPlayer(player, 'discard').length  // Number of cards in discard pile
  )

  if (deck.cardlist().length < numberToDraw) {
    this.log.add({
      template: '{player} draws the remaining {count} cards from deck',
      args: {
        player,
        count: deck.cardlist().length
      }
    })
  }

  while (hand.cardlist().length < numberToDraw) {
    const drawResult = this.aDraw(player, { silent: true })
    if (drawResult === 'no-more-cards') {
      break
    }
  }

  if (drawnAfterShuffle) {
    this.log.add({
      template: '{player} draws an additional {count} cards',
      args: {
        player,
        count: drawnAfterShuffle
      }
    })
  }

  this.log.outdent()
}

Tyrants.prototype.mRefillMarket = function(quiet=false) {
  const deck = this.zones.byId('marketDeck')
  const market = this.zones.byId('market')
  const count = 6 - market.cardlist().length

  for (let i = 0; i < count; i++) {
    const card = deck.peek()

    if (!card) {
      this.log.add({ template: 'The market deck is empty' })
      return
    }

    if (!quiet) {
      this.log.add({
        template: '{card} added to the market',
        args: { card }
      })
    }

    card.moveTo(market)
  }
}

Tyrants.prototype.mSetGhostFlag = function() {
  this.state.ghostFlag = true
}

Tyrants.prototype._checkDoingSetup = function() {
  return this.doingSetup
}
