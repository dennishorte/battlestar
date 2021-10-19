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

Game.prototype.run = function() {
  return this.sm.run()
}

Game.prototype.submit = function({ actor, name, option }) {
  const waiting = this.getWaiting()
  const action = waiting.actions[0]
  util.assert(waiting.name === actor, `Waiting for ${waiting.name} but got action from ${actor}`)
  util.assert(action.name === name, `Waiting for action ${action.name} but got ${name}`)
  util.assert(Array.isArray(option), `Got non-array selection: ${option}`)

  this.rk.sessionStart(session => {
    session.put(waiting, 'response', {
      name,
      option
    })
  })

  this.sm.run()
}

////////////////////////////////////////////////////////////////////////////////
// Actions

const actions = require('./actions.js')
for (const [name, func] of Object.entries(actions)) {
  Game.prototype[name] = func
}



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

Game.prototype.getPlayerNext = function() {
  const players = this.getPlayerAll()
  const current = this.getPlayerCurrentTurn()
  const currentIndex = players.findIndex(p => p.name === current.name)
  const nextIndex = (currentIndex + 1) % players.length
  return players[nextIndex]
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
  return this.getPlayerByName(waiting.name)
}

Game.prototype.getPlayerWithCard = function(cardName) {
  for (const player of this.getPlayerAll()) {
    const zone = this.getZoneByPlayer(player)
    if (zone.cards.find(c => c.name === cardName)) {
      return player
    }
  }
  return {}
}

Game.prototype.getWaiting = function() {
  if (this.state.sm.waiting.length) {
    return this.state.sm.waiting[0]
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

Game.prototype.mDrawSkillCard = function(player, skill) {
  player = this._adjustPlayerParam(player)

  const zone = this.getZoneBySkill(skill)
  this.mMaybeReshuffleSkillDeck(zone)

  if (zone.cards.length === 0) {
    throw new Error(`No cards left in ${skill} deck, even after reshuffle`)
  }

  const playerHand = this.getZoneByPlayer(player)

  this.mMoveByIndices(
    zone.name, 0,
    playerHand.name, playerHand.length
  )
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

  this.rk.session.push(this.state.log, util.deepcopy(msg))
}

Game.prototype.mMaybeReshuffleSkillDeck = function(zone) {
  if (zone.cards.length > 0) {
    return
  }

  const skillName = zone.name.split('.').slice(-1)[0]
  const discardName = `discard.${skillName}`
  const discardZone = this.getZoneByName(discardName)

  if (discardZone.cards.length === 0) {
    this.mLog({
      template: '{skill} deck and discard both empty. Unable to reshuffle',
      args: {
        skill: skillName
      }
    })
  }
  else {
    mLog({
      template: 'Shuffling discard pile of {skill} to make a new draw pile',
      args: {
        skill: skillName
      },
    })

    const cards = [...discardZone.cards]
    util.array.shuffle(cards)

    this.rk.session.replace(zone.cards, cards)
    this.rk.session.replace(discardZone.cards, [])
  }
}

Game.prototype.mMoveByIndices = function(sourceName, sourceIndex, targetName, targetIndex) {
  const source = this.getZoneByName(sourceName).cards
  const target = this.getZoneByName(targetName).cards
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
