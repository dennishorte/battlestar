const RecordKeeper = require('../lib/recordkeeper.js')
const StateMachine = require('../lib/statemachine.js')

const bsgutil = require('./util.js')
const initialize = require('./initialize.js')
const jsonpath = require('../lib/jsonpath.js')
const log = require('../lib/log.js')
const selector = require('../lib/selector.js')
const util = require('../lib/util.js')

module.exports = {
  Game,
  factory: stateFactory,

  deckbuilder: require('./deckbuilder.js'),
  res: require('./resources.js'),
  transitions: require('./transitions.js'),
  util: require('./util.js'),
}

function Game(state) {
  this.actor = null
  this.state = null
  this.rk = null
  this.sm = null
}

function stateFactory(lobby) {
  const state = {
    game: lobby.game,
    name: lobby.name,
    options: lobby.options,
    users: lobby.users,
    createdTimestamp: Date.now(),
    saveKey: 0,
    initialized: false,
    sm: {
      stack: [],
      waiting: [],
      response: [],
    },
  }

  initialize(state)
  return state
}

Game.prototype.load = function(transitions, state, actor) {
  const self = this

  this.actor = actor
  this.state = state
  this.rk = new RecordKeeper(state)
  this.sm = new StateMachine(
    transitions,
    this,
    this.rk,
    this.state.sm.stack,
    this.state.sm.waiting,
    this.state.sm.response,
    {
      pushCallback: stateLogger.bind(self),
    },
  )
}

// Available to overload
Game.prototype.save = async function() {}

Game.prototype.dumpLog = function() {
  const output = []
  for (const entry of this.state.log) {
    output.push(log.toString(entry))
  }
  console.log(output.join('\n'))
}

function _dumpZonesRecursive(root) {
  const output = []

  if (root.name) {
    output.push(root.name)
    for (const card of root.cards) {
      output.push(`   ${card.id}, ${card.name}`)
    }
  }

  else {
    for (const zone of Object.values(root)) {
      output.push(_dumpZonesRecursive(zone))
    }
  }

  return output.join('\n')
}

Game.prototype.dumpZones = function(root) {
  console.log(_dumpZonesRecursive(root || this.state.zones))
}

Game.prototype.run = function() {
  try {
    this.sm.run()
  }
  catch (e) {
    if (e instanceof bsgutil.GameOverTrigger) {
      this.mGameOver(e)
    }
    else {
      throw e
    }
  }
}

Game.prototype.submit = function(response) {
  const { actor, name, option } = response
  const waiting = this.getWaiting(actor)
  util.assert(!!waiting, `Got response from ${actor}, but not waiting for that player`)

  const validationResult = selector.validate(waiting, response)
  if (!validationResult.valid) {
    console.log(JSON.stringify({
      action: waiting,
      response: response,
      validationResult
    }, null, 2))
    throw new Error('Invalid response')
  }

  // Store the response for the statemachine
  this.rk.splice(this.state.sm.response, 0, this.state.sm.response.length, response)

  this.run()

  // Clean up the response
  this.rk.splice(this.state.sm.response, 0, this.state.sm.response.length)
}

////////////////////////////////////////////////////////////////////////////////
// Actions

const actions = require('./actions.js')
for (const [name, func] of Object.entries(actions)) {
  Game.prototype[name] = func
}


////////////////////////////////////////////////////////////////////////////////
// Checks

Game.prototype.checkBasestarEffect = function(ship, effectName) {
  const zone = this.getZoneByCardOrigin(ship)
  for (const card of zone.cards) {
    if (card.name === effectName) {
      return true
    }
  }
  return false
}

Game.prototype.checkColonialOneIsDestroyed = function() {
  return this.state.flags.colonialOneDestroyed
}

Game.prototype.checkEffect = function(name) {
  for (const card of this.getZoneByName('keep').cards) {
    if (card.name === name) {
      return true
    }
  }
  return false
}

Game.prototype.checkCardIsVisible = function(card, player) {
  if (!player) {
    player = this.actor
  }
  player = this._adjustPlayerParam(player)

  return (
    card.visibility.includes('all')
    || card.visibility.includes(player.name)
    || (card.visibility.includes('president') && this.checkPlayerIsPresident(player))
  )
}

Game.prototype.checkGameIsFinished = function() {
  return !!this.state.endTrigger.winner
}

Game.prototype.checkLocationIsDamaged = function(location) {
  if (typeof location === 'string' && !location.includes('.')) {
    location = this.getZoneByLocationName(location)
  }
  else {
    location = this._adjustZoneParam(location)
  }
  return !!location.cards.find(c => c.kind === 'damageGalactica')
}

Game.prototype.checkLocationIsWorking = function(location, player) {
  player = this._adjustPlayerParam(player)
  if (typeof location === 'string' && !location.includes('.')) {
    location = this.getZoneByLocationName(location)
  }
  else {
    location = this._adjustZoneParam(location)
  }

  if (location.details.name === 'Communications') {
    return (
      !this.checkEffect('Jammed Assault')
      && this.getDeployedCivilians().length > 0
    )
  }

  else if (location.details.name === "Admiral's Quarters") {
    return this.getCardCharacterByPlayer(player).name !== 'William Adama'
  }

  else if (location.details.name === 'Armory') {
    return !!this.getCenturionNext()
  }

  else if (location.details.name === 'FTL Control') {
    return this.getCounterByName('jumpTrack') >= 2
  }

  else if (location.details.name === 'Hangar Deck') {
    const character = this.getCardCharacterByPlayer(player)
    return (
      !!character.piloting
      && (
        this.getZoneByName('ships.vipers').cards.length > 0
        || this.getUnmannedVipers().length > 0
      )
    )
  }

  else if (location.details.name === "President's Office") {
    return this.checkPlayerIsPresident(player)
  }

  else if (location.details.name === 'Weapons Control') {
    return this.getCardsEnemyShips().length > 0
  }

  else {
    return true
  }
}

Game.prototype.checkPlayerDrewSkillsThisTurn = function(player) {
  player = this._adjustPlayerParam(player)
  return player.turnFlags.drewCards
}

Game.prototype.checkPlayerHasCardByName = function(player, name) {
  player = this._adjustPlayerParam(player)
  const hand = this.getZoneByPlayer(player).cards
  return !!hand.find(c => c.name === name)
}

Game.prototype.checkPlayerHasCharacter = function(player) {
  player = this._adjustPlayerParam(player)
  return !!this.getCardCharacterByPlayer(player)
}

Game.prototype.checkPlayerIsAdmiral = function(player) {
  player = this._adjustPlayerParam(player)
  return player.name === this.getPlayerAdmiral().name
}

Game.prototype.checkPlayerIsArbitrator = function(player) {
  player = this._adjustPlayerParam(player)
  return player.isArbitrator
}

Game.prototype.checkPlayerIsAtLocation = function(player, name) {
  player = this._adjustPlayerParam(player)
  const zone = this.getZoneByPlayerLocation(player)
  return zone.details && zone.details.name === name
}

Game.prototype.checkPlayerIsMissionSpecialist = function(player) {
  player = this._adjustPlayerParam(player)
  return player.isMissionSpecialist
}

Game.prototype.checkPlayerIsRevealedCylon = function(player) {
  player = this._adjustPlayerParam(player)
  return player.isRevealedCylon
}

Game.prototype.checkPlayerIsInSpace = function(player) {
  player = this._adjustPlayerParam(player)
  const zone = this.getZoneByPlayerLocation(player)
  return zone.name.startsWith('space')
}

Game.prototype.checkPlayerIsPresident = function(player) {
  player = this._adjustPlayerParam(player)
  return player.name === this.getPlayerPresident().name
}

Game.prototype.checkPlayerIsVicePresident = function(player) {
  player = this._adjustPlayerParam(player)
  return player.isVicePresident
}

Game.prototype.checkPlayerOncePerGameUsed = function(player) {
  player = this._adjustPlayerParam(player)
  return player.oncePerGameUsed
}

Game.prototype.checkZoneContains = function(zone, predicate) {
  zone = this._adjustZoneParam(zone)
  return !!zone.cards.find(predicate)
}


////////////////////////////////////////////////////////////////////////////////
// Getters

Game.prototype.getActor = function() {
  return this.actor
}

Game.prototype.getCardActiveCrisis = function() {
  return {}
}

Game.prototype.getCardById = function(id) {
  return this.getCardByPredicate(c => c.id === id).card
}

Game.prototype.getCardByKindAndName = function(kind, name) {
  return this.getCardByPredicate(c => c.kind === kind && c.name === name).card
}

Game.prototype.getCardByLocation = function(sourceName, sourceIndex) {
  return this.getZoneByName(sourceName).cards[sourceIndex]
}

Game.prototype.getCardByName = function(name) {
  return this.getCardByPredicate(c => c.name === name).card
}

// Search all zones and return the path and the card object for the first
// card matching the predicate.
Game.prototype.getCardByPredicate = function(predicate) {
  const path = jsonpath.path(this.state.zones, predicate)
  const card = jsonpath.at(this.state.zones, path)
  const zoneName = path
    .slice(1) // Remove leading '.'
    .split('.')
    .slice(0, -1)  // Remove trailing .cards[0]
    .join('.')

  return {
    card,
    zoneName,
    path,
  }
}

Game.prototype.getCardPlayerToken = function(player) {
  player = this._adjustPlayerParam(player)
  return this.getCardByPredicate(c => {
    return c.kind === 'player-token' && c.name === player.name
  })
}

Game.prototype.getCardsKindByPlayer = function(kind, player) {
  const cards = this.getZoneByPlayer(player).cards
  return cards.filter(c => c.kind === kind)
}

Game.prototype.getCardsLoyaltyByPlayer = function(player) {
  const cards = this.getZoneByPlayer(player).cards
  return cards.filter(c => c.kind === 'loyalty')
}

Game.prototype.getCardsByPredicate = function(predicate) {
  const paths = jsonpath.pathAll(this.state.zones, predicate)
  return paths.map(path => {
    const card = jsonpath.at(this.state.zones, path)
    const zoneName = path
      .slice(1) // Remove leading '.'
      .split('.')
      .slice(0, -1)  // Remove trailing .cards[0]
      .join('.')

    return {
      card,
      zoneName,
      path,
    }
  })
}

Game.prototype.getCardsEnemyShips = function() {
  return this
    .getCardsByPredicate(c => {
      return c.name
          && (c.name === 'raider' || c.name === 'heavy raider' || c.name.startsWith('Basestar'))
    })
    .filter(info => info.zoneName.startsWith('space.'))
}

Game.prototype.getCardsHeavyRaiders = function() {
  return this
    .getCardsByPredicate(c => c.name && c.name === 'heavy raider')
    .filter(info => info.zoneName.startsWith('space.'))
    .map(info => info.card)
}

Game.prototype.getCardsRaiders = function() {
  return this
    .getCardsByPredicate(c => c.name && c.name === 'raider')
    .filter(info => info.zoneName.startsWith('space.'))
    .map(info => info.card)
}

Game.prototype.getCenturionNext = function() {
  for (let i = 3; i >= 0; i--) {
    const zone = this.getZoneCenturionsByIndex(i)
    if (zone.cards.length > 0) {
      return zone.cards[0]
    }
  }

  return undefined
}

Game.prototype.getCrisis = function() {
  if (this.state.activeCrisisId) {
    return this.getCardById(this.state.activeCrisisId)
  }
  else {
    return undefined
  }
}

Game.prototype.getCounterByName = function(name) {
  return this.state.counters[name]
}

Game.prototype.getCardCharacterByPlayer = function(player) {
  player = this._adjustPlayerParam(player)
  const playerZone = this.getZoneByPlayer(player.name)
  return playerZone.cards.find(c => c.kind === 'character')
}

Game.prototype.getDamagedVipersCount = function() {
  return this.getZoneByName('ships.damagedVipers').cards.length
}

Game.prototype.getDeployedCivilians = function() {
  const civilians = []
  for (const zone of this.getZonesSpace()) {
    for (const card of zone.cards) {
      if (card.kind === 'civilian') {
        civilians.push([zone.name, card])
      }
    }
  }
  return civilians
}

Game.prototype.getDistanceToCivilian = function(startZone, direction) {
  const increment = direction === 'clockwise' ? 1 : -1
  let position = parseInt(startZone.name.slice(-1))
  for (let i = 0; i < 6; i++) {
    const zone = this.getZoneSpaceByIndex(position)
    for (const card of zone.cards) {
      if (card.kind === 'civilian') {
        return i
      }
    }
    position = (position + increment + 6) % 6
  }

  throw new Error('no civilians found')
}

Game.prototype.getGameResult = function() {
  return this.state.result
}

Game.prototype.getHandLimit = function(player) {
  player = this._adjustPlayerParam(player)
  const character = this.getCardCharacterByPlayer(player)
  if (character.name === '"Chief" Galen Tyrol') {
    return 8
  }
  else {
    return 10
  }
}

Game.prototype.getLocationsByArea = function(area) {
  return Object.values(this.getZoneAll().locations)
               .filter(l => l.details.area === area)
}

Game.prototype.getLocationsDamaged = function() {
  return this
    .getLocationsByArea('Galactica')
    .filter(l => !!l.cards.find(c => c.kind === 'damageGalactica'))
}

Game.prototype.getLog = function() {
  return this.state.log
}

Game.prototype.getLogIndent = function() {
  return this.sm.stack.length - 1
}

Game.prototype.getPlayerAdmiral = function() {
  return this.getPlayerWithCard('Admiral')
}

function _admiralSort(l, r) {
  return l[1].admiralSuccession - r[1].admiralSuccession
}

Game.prototype.getPlayerAdmiralNext = function() {
  return this
    .getPlayerAll()
    .filter(p => !this.checkPlayerIsRevealedCylon(p))
    .filter(p => this.getZoneByPlayerLocation(p).name !== 'locations.brig')
    .map(p => [p, this.getCardCharacterByPlayer(p)])
    .sort(_admiralSort)[0][0]
}

Game.prototype.getPlayerCurrentTurn = function() {
  // This calculation lets the UI render games before they are finished initializing
  const index = this.state.currentTurnPlayerIndex < 0 ? 0 : this.state.currentTurnPlayerIndex
  return this.getPlayerByIndex(index)
}

Game.prototype.getPlayerFollowing = function(player) {
  player = this._adjustPlayerParam(player)
  const players = this.getPlayerAll()
  const playerIndex = players.findIndex(p => p.name === player.name)
  const nextIndex = (playerIndex + 1) % players.length
  return players[nextIndex]
}

Game.prototype.getPlayerNext = function() {
  return this.getPlayerFollowing(this.getPlayerCurrentTurn())
}

Game.prototype.getPlayerAll = function() {
  return this.state.players
}

Game.prototype.getPlayerAllFrom = function(first) {
  first = this._adjustPlayerParam(first)
  const players = [...this.state.players]
  while (players[0].name !== first.name) {
    players.push(players.shift())
  }
  return players
}

Game.prototype.getPlayerByDescriptor = function(descriptor) {
  // Sometimes, the descriptor is a player name
  const player = this.getPlayerByName(descriptor)
  if (player) {
    return player
  }

  descriptor = util.toCamelCase(descriptor)

  if (descriptor === 'president') {
    return this.getPlayerPresident()
  }
  else if (descriptor === 'admiral') {
    return this.getPlayerAdmiral()
  }
  else if (descriptor === 'currentPlayer') {
    return this.getPlayerCurrentTurn()
  }
  else {
    throw new Error(`Unknown player descriptor: ${descriptor}`)
  }
}

Game.prototype.getPlayerByIndex = function(index) {
  return this.state.players[index]
}

Game.prototype.getPlayerByName = function(name) {
  return this.getPlayerAll().find(p => p.name === name)
}

Game.prototype.getPlayerPresident = function() {
  return this.getPlayerWithCard('President')
}

function _presidentSort(l, r) {
  return l[1].presidentSuccession - r[1].presidentSuccession
}

Game.prototype.getPlayerPresidentNext = function() {
  return this
    .getPlayerAll()
    .filter(p => !this.checkPlayerIsRevealedCylon(p))
    .map(p => [p, this.getCardCharacterByPlayer(p)])
    .sort(_presidentSort)[0][0]
}

Game.prototype.getPlayerWithCard = function(cardName) {
  for (const player of this.getPlayerAll()) {
    const zone = this.getZoneByPlayer(player)
    if (zone.cards.find(c => c.name === cardName)) {
      return player
    }
  }
  return undefined
}

Game.prototype.getRound = function() {
  return this.state.round
}

Game.prototype.getSkillCheck = function() {
  if (this.state.skillCheck.name) {
    return this.state.skillCheck
  }
  else {
    return undefined
  }
}

Game.prototype.getSpaceTargets = function(spaceZone) {
  spaceZone = this._adjustZoneParam(spaceZone)
  const enemyTypes = []
  for (const kind of ['raider', 'heavy raider', 'Basestar A', 'Basestar B']) {
    if (spaceZone.cards.find(c => c.name === kind)) {
      enemyTypes.push(kind)
    }
  }
  return enemyTypes
}

Game.prototype.getTokenDamageGalactica = function() {
  const damageZone = this.getZoneByName('decks.damageGalactica')
  return damageZone.cards[0]
}

Game.prototype.getTransition = function() {
  return this.sm.stack[this.sm.stack.length - 1]
}

// Return a list of integers. Each integer corresponds to a single unmanned viper in
// the corresponding space zone. eg. [2, 2] means two vipers in space zone space.space2
Game.prototype.getUnmannedVipers = function() {
  const output = []

  for (let i = 0; i < 6; i++) {
    const zone = this.getZoneSpaceByIndex(i)
    const vipers = zone.cards.filter(c => c.name === 'viper')
    const players = zone.cards.filter(c => c.kind === 'player-token')
    const unmannedCount = vipers.length - players.length
    for (let j = 0; j < unmannedCount; j++) {
      output.push(i)
    }
  }

  return output
}

Game.prototype.getVicePresident = function() {
  return this.getPlayerAll().filter(p => this.checkPlayerIsVicePresident(p))[0]
}

Game.prototype.getVipersNumAvailable = function() {
  return this.getZoneByName('ships.vipers').cards.length
}

/*
    [
      {
        actor: '<PLAYER_NAME>',

        // There is generally only a single action with multiple complex options.
        // The most common case for multiple actions is when someone has a choice
        // between two regular actions, such as in BSG when doing Executive Order.
        actions: [{
          name: '<ACTION_NAME>',
          count: <NUMBER>,  // shorthand for min = k, max = k
          min: <NUMBER>,  // default 0
          max: <NUMBER>,  // default infinity
          exclusive: <BOOLEAN>,  // If true, and choosing this, can't choose any other options
          exclusiveKey: '<STRING>',  // Cannot choose more than one option with the same exclusiveKey
          options: [
            '<SIMPLE_OPTION>',
            {
              <ACTION_DEFINITION> // recursive
            },
          ],
        }]
      },
    ]
 */
Game.prototype.getWaiting = function(player) {
  if (player) {
    player = this._adjustPlayerParam(player)
  }

  if (this.state.sm.waiting.length) {
    if (player) {
      return this.state.sm.waiting.find(w => w.actor === player.name)
    }
    else {
      return this.state.sm.waiting
    }
  }
  else {
    return undefined
  }
}

Game.prototype.getWinners = function() {
  return this.state.endTrigger.winner
}

Game.prototype.getZoneAdjacentToSpaceZone = function(spaceZone) {
  const zone = this._adjustZoneParam(spaceZone)
  const index = parseInt(zone.name.slice(-1))

  const clockwise = index == 5 ? 0 : index + 1
  const counter = index == 0 ? 5 : index - 1

  return [
    this.getZoneByName('space.space' + clockwise),
    this.getZoneByName('space.space' + counter)
  ]
}

Game.prototype.getZoneAll = function() {
  return this.state.zones
}

Game.prototype.getZoneBasestarByLetter = function(letter) {
  return this.getZoneByName('ships.basestar' + letter)
}

Game.prototype.getZoneBasestarByName = function(name) {
  return this.getZoneBasestarByLetter(name.slice(-1))
}

Game.prototype.getZoneByCard = function(card) {
  card = this._adjustCardParam(card)
  const { zoneName } = this.getCardByPredicate(c => c.id === card.id)
  return this.getZoneByName(zoneName)
}

// Get the zone that the card originally came from
Game.prototype.getZoneByCardOrigin = function(card) {
  card = this._adjustCardParam(card)
  return this.getZoneByName(card.deck || card.kind)
}

Game.prototype.getZoneByLocationName = function(name) {
  const zoneName = 'locations.' + util.toCamelCase(name)
  return this.getZoneByName(zoneName)
}

Game.prototype.getZoneByName = function(name) {
  const tokens = name.split('.')
  let zone = this.state.zones
  while (tokens.length) {
    const next = tokens.shift()
    zone = zone[next]
    if (!zone) {
      throw new Error(`Error loading ${next} of zone ${name}.`)
    }
  }
  return zone
}

Game.prototype.getZoneByPlayer = function(player) {
  player = this._adjustPlayerParam(player)
  return this.state.zones.players[player.name]
}

Game.prototype.getZoneByPlayerLocation = function(player) {
  player = this._adjustPlayerParam(player)
  const { card, zoneName } = this.getCardByPredicate(c => {
    return c.kind === 'player-token' && c.name === player.name
  })
  return this.getZoneByName(zoneName)
}

Game.prototype.getZoneBySkill = function(skill) {
  const name = `decks.${skill}`
  return this.getZoneByName(name)
}

Game.prototype.getZoneCenturionsByIndex = function(index) {
  return this.getZoneByName(`centurions.centurions${index}`)
}

Game.prototype.getZoneDiscardByCard = function(card) {
  card = this._adjustCardParam(card)
  const discardName = card.deck.replace(/^decks/, 'discard')
  return this.getZoneByName(discardName)
}

Game.prototype.getZoneSpaceByIndex = function(index) {
  return this.getZoneByName(`space.space${index}`)
}

Game.prototype.getZonesSpace = function() {
  return Object.values(this.state.zones.space)
}

Game.prototype.getZonesSpaceContaining = function(predicate) {
  const zones = []
  for (let i = 0; i < 6; i++) {
    const zone = this.getZoneSpaceByIndex(i)
    for (const card of zone.cards) {
      if (predicate(card)) {
        zones.push(zone)
        break
      }
    }
  }
  return zones
}

Game.prototype.getZonesWithBasestars = function() {
  const zones = []
  for (let i = 0; i < 6; i++) {
    const zone = this.getZoneSpaceByIndex(i)
    for (const card of zone.cards) {
      if (card.name.startsWith('Basestar')) {
        zones.push(zone)
        break
      }
    }
  }
  return zones
}

Game.prototype.hackImpersonate = function(player) {
  player = this._adjustPlayerParam(player)
  this.actor = player.name
}

Game.prototype.mAddCenturion = function() {
  this.mMoveCard('tokens.centurions', 'centurions.centurions0')
}

Game.prototype.mAdjustCardVisibilityToNewZone = function(zone, card) {
  zone = this._adjustZoneParam(zone)
  card = this._adjustCardParam(card)

  const zoneVis = zone.visibility || zone.kind

  if (
    zoneVis === 'open'
    || (zone.name === 'crisisPool' && this.getSkillCheck().investigativeCommittee)
  ) {
    this.rk.replace(card.visibility, this.getPlayerAll().map(p => p.name))
  }
  else if (zoneVis === 'president') {
    this.rk.replace(card.visibility, [this.getPlayerWithCard('President').name])
  }
  else if (zoneVis === 'owner') {
    this.rk.replace(card.visibility, [zone.owner])
  }
  else if (zoneVis === 'deck'
           || zoneVis === 'hidden'
           || zoneVis === 'bag') {
    this.rk.replace(card.visibility, [])
  }
  else {
    throw new Error(`Unknown zone visibility (${zoneVis}) for zone ${zone.name}`)
  }
}

Game.prototype.mAdjustCounterByName = function(name, amount) {
  const direction = amount > 0 ? 'increased' : 'reduced'
  this.mLog({
    template: `{resource} ${direction} by {amount}`,
    args: {
      resource: name,
      amount: Math.abs(amount)
    }
  })

  let newValue = this.state.counters[name] + amount
  newValue = Math.max(newValue, 0)
  if (name === 'jumpTrack' || name === 'raptors') {
    newValue = Math.min(newValue, 4)
  }

  this.rk.put(this.state.counters, name, newValue)
}

Game.prototype.mRemoveViperAt = function(spaceZone, action) {
  spaceZone = this._adjustZoneParam(spaceZone)
  const vipers = spaceZone.cards.filter(c => c.kind === 'ships.vipers')
  const characters = spaceZone.cards.filter(c => c.kind === 'player-token')
  const viperIsPiloted = characters.length >= vipers.length

  let playerDestination
  let viperDestination
  let viperMessage
  if (action === 'land') {
    playerDestination = 'Hangar Deck'
    viperDestination = 'ships.vipers'
    viperMessage = 'landed'
  }
  else if (action === 'damage') {
    playerDestination = 'Sickbay'
    viperDestination = 'ships.damagedVipers'
    viperMessage = 'damaged'
  }
  else if (action === 'destroy') {
    playerDestination = 'Sickbay'
    viperDestination = 'exile'
    viperMessage = 'destroyed'
  }
  else {
    throw new Error(`Unknown viper action: ${action}`)
  }

  this.mMoveCard(spaceZone, viperDestination, vipers[0])
  this.mLog({
    template: `Viper at {location} ${viperMessage}`,
    args: {
      location: spaceZone.name
    }
  })

  if (viperIsPiloted) {
    const playerDestinationZone = this.getZoneByLocationName(playerDestination)
    this.mMoveCard(spaceZone, playerDestinationZone, characters.pop())
    this.mLog({
      template: `{player} moved to {location}`,
      args: {
        player: characters.name,
        location: playerDestination,
      }
    })
  }
}

const shipNamesToZoneNames = {
  basestar: ['ships.basestarA', 'ships.basestarB'],
  civilian: 'decks.civilian',
  raider: 'ships.raiders',
  viper: 'ships.vipers',

  'heavy raider': 'ships.heavyRaiders',
}
Game.prototype.mDeploy = function(spaceZone, shipName, count) {
  spaceZone = this._adjustZoneParam(spaceZone)
  count = count || 1

  for (let i = 0; i < count; i++) {
    if (shipName === 'basestar') {
      let basestarZone = null
      let basestarCard = null
      for (const zoneName of shipNamesToZoneNames.basestar) {
        const tmpZone = this.getZoneByName(zoneName)
        const tmpCard = tmpZone.cards.find(c => c.name.startsWith('Basestar'))
        if (tmpCard) {
          basestarZone = tmpZone
          basestarCard = tmpCard
          break
        }
      }

      if (basestarZone) {
        this.mMoveCard(basestarZone, spaceZone, basestarCard)
      }
      else {
        this.mLog({
          template: 'Unable to deploy {ship}; supply is empty',
          args: { ship: shipName }
        })
      }
    }

    else {
      const shipZoneName = shipNamesToZoneNames[shipName]
      const shipZone = this.getZoneByName(shipZoneName)

      if (shipZone.cards.length === 0) {
        this.mLog({
          template: 'Unable to deploy {ship}; supply is empty',
          args: { ship: shipName }
        })
      }
      else {
        this.mMoveCard(shipZone, spaceZone)
      }
    }
  }
}

Game.prototype.mDiscard = function(cardId) {
  if (typeof cardId !== 'string') {
    cardId = cardId.id
  }

  const { card, zoneName } = this.getCardByPredicate(c => c.id === cardId)

  if (
    card.kind.startsWith('ships.')
    || card.kind.startsWith('tokens.')
  ) {
    this.mMoveCard(zoneName, card.kind, card)
  }

  else if (card.kind === 'civilian') {
    this.mMoveCard(zoneName, 'decks.civilian', card)
  }

  else if (card.kind === 'crisis') {
    this.mMoveCard(zoneName, 'discard.crisis', card)
  }

  else if (card.kind === 'skill') {
    const discard = this.getZoneByName(`decks.${card.skill}`)
    this.mMoveCard(zoneName, discard, card)
  }

  else if (card.kind === 'damageBasestar') {
    this.mMoveCard(zoneName, 'decks.damageBasestar', card)
  }

  else if (card.kind === 'damageGalactica') {
    if (card.name.startsWith('-')) {
      this.mMoveCard(zoneName, 'exile', card)
    }
    else {
      this.mMoveCard(zoneName, 'decks.damageGalactica', card)
    }
  }

  else if (card.kind === 'quorum') {
    this.mMoveCard(zoneName, 'discard.quorum', card)
  }

  else {
    throw new Error(`Unhandled discard: ${card.kind}`)
  }
}

Game.prototype.mDrawSkillCard = function(player, skill) {
  player = this._adjustPlayerParam(player)

  const zone = this.getZoneBySkill(skill)
  this.mMaybeReshuffleDeck(zone)

  if (zone.cards.length === 0) {
    throw new Error(`No cards left in ${skill} deck, even after reshuffle`)
  }

  const playerHand = this.getZoneByPlayer(player)
  this.mMoveCard(zone, playerHand)
}

Game.prototype.mDrawDestinationCard = function(player) {
  player = this._adjustPlayerParam(player)

  const zone = this.getZoneByName('decks.destination')
  this.mMaybeReshuffleDeck(zone)

  if (zone.cards.length === 0) {
    throw new Error(`No cards left in destination deck, even after reshuffle`)
  }

  const playerHand = this.getZoneByPlayer(player)
  this.mMoveCard(zone, playerHand)
}

Game.prototype.mExile = function(card) {
  card = this._adjustCardParam(card)
  this.mMoveCard(this.getZoneByCard(card), 'exile', card)
}

Game.prototype.mGameOver = function(trigger) {
  // Set the game status
  this.rk.put(this.state, 'endTrigger', {
    winner: trigger.winner,
    message: trigger.message,
  })

  // Empty the stack
  while (this.sm.stack.length > 1) {
    this.rk.pop(this.sm.stack)
  }

  // Put the END transition on the stack
  this.rk.push(this.sm.stack, { name: 'END' })
}

Game.prototype.mKeep = function(card) {
  card = this._adjustCardParam(card)
  this.mMoveCard(this.getZoneByCard(card), 'keep', card)
}

Game.prototype.mLaunchViper = function(position) {
  if (position.startsWith('Lower')) {
    position = (position === 'Lower Left') ? 'space.space5' : 'space.space4'
  }
  const spaceZone = this.getZoneByName(position)
  const viperZone = this.getZoneByName('ships.vipers')
  this.mMoveCard(viperZone, spaceZone)
}

Game.prototype.mLog = function(msg) {
  if (!msg.classes) {
    msg.classes = []
  }
  if (!msg.args) {
    msg.args = {}
  }

  enrichLogArgs(msg)
  msg.id = this.getLog().length
  msg.indent = this.getLogIndent()

  // Making a copy here makes sure that the log items are always distinct from
  // wherever their original data came from.
  this.rk.push(this.state.log, util.deepcopy(msg))
}

Game.prototype.mMaybeReshuffleDeck = function(zone) {
  if (zone.cards.length > 0) {
    return false
  }

  const discardName = zone.name.replace('decks.', 'discard.')
  const discardZone = this.getZoneByName(discardName)

  if (discardZone.cards.length === 0) {
    this.mLog({
      template: '{zone} deck and discard both empty. Unable to reshuffle',
      args: {
        zone: zone.name
      }
    })
  }
  else {
    mLog({
      template: 'Shuffling discard pile of {zone} to make a new draw pile',
      args: {
        zone: zone.name
      },
    })

    this.rk.replace(zone.cards, discardZone.cards)
    this.rk.replace(discardZone.cards, [])
    this.mShuffleZone(zone)
  }
}

Game.prototype.mMaybeShuffleBag = function(zone) {
  zone = this._adjustZoneParam(zone)
  if (zone.kind === 'bag') {
    this.mShuffleZone(zone)
  }
}

// This function takes care of all the details of card movement, including
// reshuffling discard piles, visibility, etc.
Game.prototype.mMoveCard = function(source, target, card, options = {}) {
  source = this._adjustZoneParam(source)
  target = this._adjustZoneParam(target)

  this.mMaybeReshuffleDeck(source)

  let cardIndex = 0

  if (card) {
    card = this._adjustCardParam(card)
    cardIndex = source.cards.findIndex(c => c.id === card.id)
  }
  else {
    card = source.cards[0]
  }

  if (source.cards[cardIndex] === undefined) {
    console.log(source)
    console.log(target)
    console.log(cardIndex)
    console.log(card)
    throw new Error('Trying to move undefined card')
  }

  const targetIndex = options.top ? 0 : target.cards.length

  this.mMoveByIndices(source, cardIndex, target, targetIndex)
  this.mMaybeShuffleBag(target)

  // Refresh the card; it seems that its object "sometimes" gets changed by the shuffling
  card = this.getCardById(card.id)

  this.mAdjustCardVisibilityToNewZone(target, card)

  return card
}

Game.prototype.mMoveByIndices = function(sourceName, sourceIndex, targetName, targetIndex) {
  const source = this._adjustZoneParam(sourceName).cards
  const target = this._adjustZoneParam(targetName).cards
  const card = source[sourceIndex]
  this.rk.splice(source, sourceIndex, 1)
  this.rk.splice(target, targetIndex, 0, card)
}

Game.prototype.mMoveAroundSpace = function(ship, direction) {
  ship = this._adjustCardParam(ship)
  const increment = direction === 'clockwise' ? 1 : -1
  const zone = this.getZoneByCard(ship)
  util.assert(zone.name.startsWith('space.space'), "Can't move clockwise; ship is not in space")
  const zoneIndex = parseInt(zone.name.slice(-1))
  const nextIndex = (zoneIndex + increment + 6) % 6
  const nextZone = this.getZoneSpaceByIndex(nextIndex)
  this.mMoveCard(zone, nextZone, ship)
}

Game.prototype.mMovePlayer = function(player, destination) {
  player = this._adjustPlayerParam(player)
  destination = this._adjustZoneParam(destination)

  const { card } = this.getCardPlayerToken(player)
  this.rk.move(card, destination.cards, destination.cards.length)
}

Game.prototype.mReturnCardToTop = function(card) {
  card = this._adjustCardParam(card)
  const fromZone = this.getCardByPredicate(c => c.id === card.id).zoneName
  const destZone = this.getZoneByCardOrigin(card)
  this.mMoveCard(fromZone, destZone, card, { top: true })
}

Game.prototype.mReturnCardToBottom = function(card) {
  card = this._adjustCardParam(card)
  const fromZone = this.getCardByPredicate(c => c.id === card.id).zoneName
  const destZone = this.getZoneByCardOrigin(card)
  this.mMoveCard(fromZone, destZone, card)
}

Game.prototype.mReturnViperFromSpaceZone = function(zoneNumber) {
  const spaceZone = this.getZoneByName('space.space' + zoneNumber)
  const viperZone = this.getZoneByName('ships.vipers')
  const viper = spaceZone.cards.find(c => c.name === 'viper')
  this.rk.move(viper, viperZone.cards)
}

Game.prototype.mRevealCard = function(card) {
  this.rk.put(card, 'visibility', this.getPlayerAll().map(p => p.name))
}

Game.prototype.mSetCrisisActive = function(card) {
  util.assert(!this.state.activeCrisisId, 'Crisis already active!')
  card = this._adjustCardParam(card)
  this.rk.put(this.state, 'activeCrisisId', card.id)
  this.mMoveCard(this.getZoneByCard(card), 'keep', card)
  this.mLog({
    template: '"{card}" crisis begins',
    args: { card }
  })
}

Game.prototype.mSetOncePerGameAbilityUsed = function(player) {
  player = this._adjustPlayerParam(player)
  this.rk.put(player, 'oncePerGameUsed', true)
}

Game.prototype.mRollDie = function(player) {
  if (player) {
    player = this._adjustPlayerParam(player)
  }

  const dieRoll = Math.floor(Math.random() * 8) + 1

  if (player) {
    this.mLog({
      template: '{player} rolls {dieRoll}',
      args: {
        player: player.name,
        dieRoll
      }
    })
  }
  else {
    this.mLog({
      template: 'die roll: {dieRoll}',
      args: { dieRoll }
    })
  }

  return dieRoll
}

Game.prototype.mSetGameResult = function(result) {
  this.state.result = result
}

Game.prototype.mSetPlayerFlag = function(player, flag, value) {
  player = this._adjustPlayerParam(player)
  this.rk.put(player, flag, value)
}

Game.prototype.mSetPlayerIsRevealedCylon = function(player) {
  this.mSetPlayerFlag(player, 'isRevealedCylon', true)
}

Game.prototype.mSetSkillCheck = function(check) {
  util.assert(!this.skillCheck, "Skill check in progress. Can't set a new one.")

  // Make a deep copy so that any info copied from a card is no longer tied to that card
  check = util.deepcopy(check)
  check.result = ''
  check.cardsAdded = []
  check.total = 'not ready'
  check.shortCut = ''   // Used when some ability causes the result to be chosen out of order
  check.resolved = false

  check.declareEmergency = false
  check.inspirationalLeader = false
  check.investigativeCommittee = false
  check.scientificResearch = false

  check.flags = {}
  for (const player of this.getPlayerAll()) {
    check.flags[player.name] = {
      submitted: {
        discussion: false,
        addCards: false,
        declareEmergency: false,
      },
      numAdded: 0,
      support: '',
      useDeclareEmergency: false,
      useScientificResearch: false,
      useInvestigativeCommitee: false,
    }
  }
  this.rk.put(this.state, 'skillCheck', check)
}

Game.prototype.mShuffleZone = function(zone) {
  zone = this._adjustZoneParam(zone)
  const cards = [...zone.cards]
  util.array.shuffle(cards)

  // This operation somehow causes object references to change.
  // I've walked through it several times and have no idea why.
  // If you're getting weird errors, get your card anew with getCardById
  this.rk.replace(zone.cards, cards)
}

Game.prototype.mStartNextTurn = function() {
  const nextIndex = (this.state.currentTurnPlayerIndex + 1) % this.getPlayerAll().length
  this.rk.put(this.state, 'currentTurnPlayerIndex', nextIndex)

  // Reset the player turn flags
  const player = this.getPlayerByIndex(nextIndex)
  this.rk.replace(player.turnFlags, {
    drewCards: false,
    optionalSkillChoices: [],
  })
}

Game.prototype._adjustCardParam = function(card) {
  if (typeof card === 'object') {
    return card
  }

  else if (typeof card === 'string') {
    // If the string contains a dash, it could be a card id
    if (card.includes('-')) {
      card = this.getCardById(card)
      if (card) {
        return card
      }
    }

    // The string might be a card name.
    // This isn't guaranteed to be unique. Many cards have duplicate names.
    card = this.getCardByName(card)
    if (card) {
      return card
    }
  }

  throw new Error(`Unable to convert ${card} into a card`)
}

Game.prototype._adjustCardsParam = function(cards) {
  for (let i = 0; i < cards.length; i++) {
    cards[i] = this._adjustCardParam(cards[i])
  }
  return cards
}

Game.prototype._adjustPlayerParam = function(param) {
  if (typeof param === 'string') {
    return this.getPlayerByName(param)
  }
  else if (typeof param === 'object') {
    return param
  }
  else {
    throw new Error(`Unable to convert ${param} into a player`)
  }
}

Game.prototype._adjustZoneParam = function(param) {
  if (typeof param === 'string') {
    return this.getZoneByName(param)
  }
  else if (typeof param === 'object') {
    return param
  }
  else {
    throw new Error(`Unable to convert ${param} into a zone`)
  }
}


function enrichLogArgs(msg) {
  for (const key of Object.keys(msg.args)) {
    // Convert string args to a dict
    if (typeof msg.args[key] !== 'object') {
      msg.args[key] = {
        value: msg.args[key],
      }
    }

    // Ensure the dict has a classes entry
    const classes = msg.args[key].classes || []
    msg.args[key].classes = classes

    if (key === 'player') {
      util.array.pushUnique(classes, 'player-name')
    }
    else if (key === 'character') {
      util.array.pushUnique(classes, 'character-name')
      util.array.pushUnique(classes, bsgutil.characterNameToCssClass(msg.args[key].value))
    }
    else if (key === 'location') {
      util.array.pushUnique(classes, 'location-name')
    }
    else if (key === 'phase') {
      util.array.pushUnique(classes, 'phase-name')
    }
    else if (key === 'title') {
      util.array.pushUnique(classes, 'title-name')
    }
    else if (key === 'card') {
      const card = msg.args['card']
      if (typeof card !== 'object') {
        throw new Error(`Pass whole card object to log for better logging. Got: ${card}`)
      }
      msg.args['card'] = {
        value: card.name,
        visibility: card.visibility,
        kind: card.kind,
        classes: [`card-${card.kind}`],
      }
    }
    else if (key === 'zone') {
      const zone = msg.args['zone']
      if (typeof zone !== 'object') {
        throw new Error(`Pass whole zone object to log for better logging. Got: ${zone}`)
      }
      msg.args['zone'] = {
        value: zone.name,
        classes: ['zone-name']
      }
    }
  }
}

function stateLogger(name, data) {
  if (!data) {
    data = {}
  }

  const entry = {
    template: '{transition}',
    classes: ['game-transition'],
    args: {
      transition: name,
    }
  }

  if (data.playerName) {
    entry.template += ' ({player})'
    entry.args.player = data.playerName
  }

  this.mLog(entry)
}
