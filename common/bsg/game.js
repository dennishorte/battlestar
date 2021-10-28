const RecordKeeper = require('../lib/recordkeeper.js')
const StateMachine = require('../lib/statemachine.js')

const bsgutil = require('./util.js')
const initialize = require('./initialize.js')
const jsonpath = require('../lib/jsonpath.js')
const log = require('../lib/log.js')
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

Game.prototype.dumpHistory = function() {
  const output = []

  for (const session of this.state.history) {
    const transitionPush = session.find(diff => {
      return diff.path === '.sm.stack' && diff.old.length === 0
    })

    if (transitionPush) {
      output.push(session[0].new)
    }
  }

  console.log(output)
}

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
  return this.sm.run()
}

Game.prototype.submit = function(response) {
  const { actor, name, option } = response
  const waiting = this.getWaiting(actor)
  util.assert(!!waiting, `Got response from ${actor}, but not waiting for that player`)

  const action = waiting.actions[0]
  util.assert(action.name === name, `Waiting for action ${action.name} but got ${name}`)
  util.assert(Array.isArray(option), `Got non-array selection: ${option}`)

  this.rk.sessionStart(session => {
    session.splice(this.state.sm.response, 0, this.state.sm.response.length, response)
  })

  this.sm.run()
}

////////////////////////////////////////////////////////////////////////////////
// Actions

const actions = require('./actions.js')
for (const [name, func] of Object.entries(actions)) {
  Game.prototype[name] = func
}


////////////////////////////////////////////////////////////////////////////////
// Checks

Game.prototype.checkColonialOneIsDestroyed = function() {
  return this.state.flags.colonialOneDestroyed
}

Game.prototype.checkPlayerHasCharacter = function(player) {
  player = this._adjustPlayerParam(player)
  return !!this.getCardCharacterByPlayer(player)
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

Game.prototype.checkLocationIsDamaged = function(location) {
  location = this._adjustZoneParam(location)
  return !!location.cards.find(c => c.kind === 'damageGalactica')
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

Game.prototype.checkPlayerIsAtLocation = function(player, name) {
  player = this._adjustPlayerParam(player)
  const zone = this.getZoneByPlayerLocation(player)
  return zone.details && zone.details.name === name
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
  const president = this.getPlayerWithCard('President')
  return player.name === president.name
}

Game.prototype.getActor = function() {
  return this.actor
}

Game.prototype.getCardActiveCrisis = function() {
  return {}
}

Game.prototype.getCardById = function(id) {
  return this.getCardByPredicate(c => c.id === id).card
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
    fullPath: path,
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

Game.prototype.getCounterByName = function(name) {
  return this.state.counters[name]
}

Game.prototype.getCardCharacterByPlayer = function(player) {
  player = this._adjustPlayerParam(player)
  const playerZone = this.getZoneByPlayer(player.name)
  return playerZone.cards.find(c => c.kind === 'character')
}

Game.prototype.getLocationsByArea = function(area) {
  return Object.values(this.getZoneAll().locations)
               .filter(l => l.details.area === area)
}

Game.prototype.getLog = function() {
  return this.state.log
}

Game.prototype.getLogIndent = function() {
  return this.sm.stack.length - 1
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

Game.prototype.getPlayerByIndex = function(index) {
  return this.state.players[index]
}

Game.prototype.getPlayerByName = function(name) {
  return this.getPlayerAll().find(p => p.name === name)
}

Game.prototype.getPlayerWaitingFor = function() {
  const waiting = this.getWaiting()
  return this.getPlayerByName(waiting.actor)
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

Game.prototype.getVipersNumAvailable = function() {
  return this.getZoneByName('ships.vipers').cards.length
}

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
      throw `Error loading ${next} of zone ${name}.`
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

Game.prototype.getZoneDiscardByCard = function(card) {
  card = this._adjustCardParam(card)
  const discardName = card.deck.replace(/^decks/, 'discard')
  return this.getZoneByName(discardName)
}

Game.prototype.hackImpersonate = function(player) {
  player = this._adjustPlayerParam(player)
  this.actor = player.name
}

Game.prototype.mAdjustCardVisibilityToNewZone = function(zone, card) {
  zone = this._adjustZoneParam(zone)
  card = this._adjustCardParam(card)

  const zoneVis = zone.visibility || zone.kind

  if (
    zoneVis === 'open'
    || (zone.name === 'crisisPool' && this.getSkillCheck().investigativeCommittee)
  ) {
    this.rk.session.replace(card.visibility, this.getPlayerAll().map(p => p.name))
  }
  else if (zoneVis === 'president') {
    this.rk.session.replace(card.visibility, [this.getPlayerWithCard('President').name])
  }
  else if (zoneVis === 'owner') {
    this.rk.session.replace(card.visibility, [zone.owner])
  }
  else if (zoneVis === 'deck'
           || zoneVis === 'hidden'
           || zoneVis === 'bag') {
    this.rk.session.replace(card.visibility, [])
  }
  else {
    throw `Unknown zone visibility (${zoneVis}) for zone ${zone.name}`
  }
}

Game.prototype.mClearWaiting = function() {
  this.sm.clearWaiting()
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

Game.prototype.mLaunchViper = function(position) {
  const spaceZoneName = position === 'Lower Left' ? 'space.space5' : 'space.space4'
  const spaceZone = this.getZoneByName(spaceZoneName)
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
  this.rk.session.push(this.state.log, util.deepcopy(msg))
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

    this.rk.session.replace(zone.cards, discardZone.cards)
    this.rk.session.replace(discardZone.cards, [])
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
Game.prototype.mMoveCard = function(source, target, card) {
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

  this.mMoveByIndices(source, cardIndex, target, target.cards.length)
  this.mMaybeShuffleBag(target)

  // Refresh the card; it seems that its object "sometimes" gets changed by the shuffling
  card = this.getCardById(card.id)

  this.mAdjustCardVisibilityToNewZone(target, card)
}

Game.prototype.mMoveByIndices = function(sourceName, sourceIndex, targetName, targetIndex) {
  const source = this._adjustZoneParam(sourceName).cards
  const target = this._adjustZoneParam(targetName).cards
  const card = source[sourceIndex]
  this.rk.session.splice(source, sourceIndex, 1)
  this.rk.session.splice(target, targetIndex, 0, card)
}

Game.prototype.mMovePlayer = function(player, destination) {
  player = this._adjustPlayerParam(player)
  destination = this._adjustZoneParam(destination)
  const { card } = this.getCardPlayerToken(player)
  this.rk.session.move(card, destination.cards, destination.cards.length)
}

Game.prototype.mReturnViperFromSpaceZone = function(zoneNumber) {
  const spaceZone = this.getZoneByName('space.space' + zoneNumber)
  const viperZone = this.getZoneByName('ships.vipers')
  const viper = spaceZone.cards.find(c => c.name === 'viper')
  this.rk.session.move(viper, viperZone.cards)
}

Game.prototype.mSetPlayerIsRevealedCylon = function(player) {
  player = this._adjustPlayerParam(player)
  this.rk.session.put(player, 'isRevealedCylon', true)
}

Game.prototype.mSetSkillCheck = function(check) {
  util.assert(!this.skillCheck, "Skill check in progress. Can't set a new one.")

  // Make a deep copy so that any info copied from a card is no longer tied to that card
  check = util.deepcopy(check)
  check.result = ''
  check.scientificResearch = false
  check.investigativeCommittee = false
  check.discussion = {}
  check.addCards = {}
  for (const player of this.getPlayerAll()) {
    check.discussion[player.name] = {
      support: '',
      useScientificResearch: false,
      useInvestigativeCommitee: false,
    }
    check.addCards[player.name] = {
      submitted: false,
      numAdded: 0,
      useDeclareEmergency: false,
    }
  }
  this.rk.session.put(this.state, 'skillCheck', check)
}

Game.prototype.mShuffleZone = function(zone) {
  zone = this._adjustZoneParam(zone)
  const cards = [...zone.cards]
  util.array.shuffle(cards)

  // This operation somehow causes object references to change.
  // I've walked through it several times and have no idea why.
  // If you're getting weird errors, get your card anew with getCardById
  this.rk.session.replace(zone.cards, cards)
}

Game.prototype.mStartNextTurn = function() {
  const nextIndex = (this.state.currentTurnPlayerIndex + 1) % this.getPlayerAll().length
  this.rk.session.put(this.state, 'currentTurnPlayerIndex', nextIndex)

  // Reset the player turn flags
  const player = this.getPlayerByIndex(nextIndex)
  this.rk.session.replace(player.turnFlags, {
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
      const card = this.getCardById(card)
      if (card) {
        return card
      }
    }

    // The string might be a card name.
    // This isn't guaranteed to be unique. Many cards have duplicate names.
    const card = this.getCardByName(card)
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
        throw `Pass whole card object to log for better logging. Got: ${card}`
      }
      msg.args['card'] = {
        value: card.name,
        visibility: card.visibility,
        kind: card.kind,
        classes: [`card-${card.kind}`],
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
