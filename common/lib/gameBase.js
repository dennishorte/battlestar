const RecordKeeper = require('../lib/recordkeeper.js')
const StateMachine = require('../lib/statemachine.js')

const jsonpath = require('../lib/jsonpath.js')
const log = require('../lib/log.js')
const selector = require('../lib/selector.js')
const util = require('../lib/util.js')

module.exports = {
  GameBase,
  GameOverTrigger,
  stateFactory,
}

function GameBase() {
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

    // Current turn information
    turn: {
      round: 0,
      count: 0,
      playerIndex: -1,
    },

    // Standard data containers
    counters: {},
    flags: {},
    zones: {},

    // User facing log
    log: [],

    // By incrementing this each time the game is saved, we can check if a save request would
    // overwrite another save and prevent that from happening.
    saveKey: 0,

    // RecordKeeper persistent state
    history: [],

    // StateMachine persistent state
    sm: {
      stack: [],
      waiting: [],
      response: [],
    },
  }

  return state
}

function GameOverTrigger(reason) {
  this.reason = reason
}

GameBase.prototype.load = function(transitions, state, enrichContext) {
  const self = this

  const options = {
    enrichContext: enrichContext || (() => {}),
    pushCallback: stateLogger.bind(self),
  }

  this.state = state
  this.rk = new RecordKeeper(state)
  this.sm = new StateMachine(
    transitions,
    this,
    this.rk,
    this.state.sm.stack,
    this.state.sm.waiting,
    this.state.sm.response,
    options,
  )
}

// Available to overload
GameBase.prototype.save = async function() {}

GameBase.prototype.run = function() {
  try {
    this.sm.run()
  }
  catch (e) {
    if (e instanceof GameOverTrigger) {
      this.mGameOver(e)
    }
    else {
      throw e
    }
  }
}

GameBase.prototype.submit = function(response) {
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
// Checks

GameBase.prototype.checkCardIsVisible = function(card, player) {
  player = this._adjustPlayerParam(player)

  return (
    card.visibility.includes('all')
    || card.visibility.includes(player.name)
    || (card.visibility.includes('president') && this.checkPlayerIsPresident(player))
  )
}

GameBase.prototype.checkGameBaseIsFinished = function() {
  return !!this.state.result.winner
}

GameBase.prototype.checkZoneContains = function(zone, predicate) {
  zone = this._adjustZoneParam(zone)
  return !!zone.cards.find(predicate)
}


////////////////////////////////////////////////////////////////////////////////
// Getters

GameBase.prototype.getCardById = function(id) {
  return this.getCardByPredicate(c => c.id === id).card
}

GameBase.prototype.getCardByName = function(name) {
  return this.getCardByPredicate(c => c.name === name).card
}

// Search all zones and return the path and the card object for the first
// card matching the predicate.
GameBase.prototype.getCardByPredicate = function(predicate) {
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

GameBase.prototype.getCardsByPredicate = function(predicate) {
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

GameBase.prototype.getCounterByName = function(name) {
  return this.state.counters[name]
}

GameBase.prototype.getGameBaseResult = function() {
  return this.state.result
}

GameBase.prototype.getLog = function() {
  return this.state.log
}

GameBase.prototype.getLogIndent = function(msg) {
  const log = this.getLog()

  const parentLogIndent = this.getTransition().data.parentLogIndent
  if (parentLogIndent !== undefined) {
    return parentLogIndent + 1
  }

  const parentLogId = this.getTransition().data.parentLogId
  if (!parentLogId) {
    return 0
  }
  else {
    const msg = log.find(msg => msg.id === parentLogId)
    return msg.indent + 1
  }
}

GameBase.prototype.getPlayerCurrentTurn = function() {
  // This calculation lets the UI render games before they are finished initializing
  const index = this.state.turn.playerIndex < 0 ? 0 : this.state.turn.playerIndex
  return this.getPlayerByIndex(index)
}

GameBase.prototype.getPlayerFollowing = function(player) {
  player = this._adjustPlayerParam(player)
  const players = this.getPlayerAll()
  const playerIndex = players.findIndex(p => p.name === player.name)
  const nextIndex = (playerIndex + 1) % players.length
  return players[nextIndex]
}

GameBase.prototype.getPlayerNext = function() {
  return this.getPlayerFollowing(this.getPlayerCurrentTurn())
}

GameBase.prototype.getPlayerAll = function() {
  return this.state.players
}

GameBase.prototype.getPlayerAllFrom = function(first) {
  first = this._adjustPlayerParam(first)
  const players = [...this.state.players]
  while (players[0].name !== first.name) {
    players.push(players.shift())
  }
  return players
}

GameBase.prototype.getPlayerByIndex = function(index) {
  return this.state.players[index]
}

GameBase.prototype.getPlayerByName = function(name) {
  return this.getPlayerAll().find(p => p.name === name)
}

GameBase.prototype.getRound = function() {
  return this.state.round
}

GameBase.prototype.getTransition = function() {
  return this.sm.stack[this.sm.stack.length - 1]
}

GameBase.prototype.getTurnCount = function() {
  return this.state.turn.count
}

GameBase.prototype.getTurnRound = function() {
  return this.state.turn.round
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
GameBase.prototype.getWaiting = function(player) {
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

GameBase.prototype.getWinners = function() {
  return this.state.endTrigger.winner
}

GameBase.prototype.getZoneAll = function() {
  return this.state.zones
}

GameBase.prototype.getZoneByCard = function(card) {
  card = this._adjustCardParam(card)
  const { zoneName } = this.getCardByPredicate(c => c.id === card.id)
  return this.getZoneByName(zoneName)
}

// Get the zone that the card originally came from
GameBase.prototype.getZoneByCardOrigin = function(card) {
  card = this._adjustCardParam(card)
  return this.getZoneByName(card.deck || card.kind)
}

GameBase.prototype.getZoneByName = function(name) {
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

GameBase.prototype.mAdjustCardVisibilityToNewZone = function(zone, card) {
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

GameBase.prototype.mAdjustCounterByName = function(name, amount) {
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

GameBase.prototype.mGameOver = function(trigger) {
  throw new Error('not implemented')
}

GameBase.prototype.mLog = function(msg, increaseIndent) {
  if (!msg.template) {
    console.log(msg)
    throw new Error(`Invalid log entry; no template`)
  }

  if (!msg.classes) {
    msg.classes = []
  }
  if (!msg.args) {
    msg.args = {}
  }

  this.utilEnrichLogArgs(msg)
  msg.id = this.getLog().length
  msg.indent = this.getLogIndent(msg)

  // Making a copy here makes sure that the log items are always distinct from
  // wherever their original data came from.
  this.rk.push(this.state.log, util.deepcopy(msg))

  return msg.id
}

GameBase.prototype.mMoveByIndices = function(sourceName, sourceIndex, targetName, targetIndex) {
  const source = this._adjustZoneParam(sourceName).cards
  const target = this._adjustZoneParam(targetName).cards
  const card = source[sourceIndex]
  this.rk.splice(source, sourceIndex, 1)
  this.rk.splice(target, targetIndex, 0, card)
}

GameBase.prototype.mReturnCardToTop = function(card) {
  card = this._adjustCardParam(card)
  const fromZone = this.getCardByPredicate(c => c.id === card.id).zoneName
  const destZone = this.getZoneByCardOrigin(card)
  this.mMoveCard(fromZone, destZone, card, { top: true })
}

GameBase.prototype.mReturnCardToBottom = function(card) {
  card = this._adjustCardParam(card)
  const fromZone = this.getCardByPredicate(c => c.id === card.id).zoneName
  const destZone = this.getZoneByCardOrigin(card)
  this.mMoveCard(fromZone, destZone, card)
}

GameBase.prototype.mRevealCard = function(card) {
  this.rk.put(card, 'visibility', this.getPlayerAll().map(p => p.name))
}

GameBase.prototype.mSetPlayerFlag = function(player, flag, value) {
  player = this._adjustPlayerParam(player)
  this.rk.put(player, flag, value)
}

GameBase.prototype.mShuffleZone = function(zone) {
  zone = this._adjustZoneParam(zone)
  const cards = [...zone.cards]
  util.array.shuffle(cards)

  // This operation somehow causes object references to change.
  // I've walked through it several times and have no idea why.
  // If you're getting weird errors, get your card anew with getCardById
  this.rk.replace(zone.cards, cards)
}

GameBase.prototype.mStartNextTurn = function() {
  const nextIndex = (this.state.currentTurnPlayerIndex + 1) % this.getPlayerAll().length
  this.rk.put(this.state, 'currentTurnPlayerIndex', nextIndex)
}

GameBase.prototype._adjustCardParam = function(card) {
  if (typeof card === 'object') {
    return card
  }

  else if (typeof card === 'string') {
    // First, test if the string is a card id.
    card = this.getCardById(card)
    if (card) {
      return card
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

GameBase.prototype._adjustCardsParam = function(cards) {
  for (let i = 0; i < cards.length; i++) {
    cards[i] = this._adjustCardParam(cards[i])
  }
  return cards
}

GameBase.prototype._adjustPlayerParam = function(param) {
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

GameBase.prototype._adjustZoneParam = function(param) {
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

// To be overridden in subclasses for superior logging
GameBase.prototype.utilEnrichLogArgs = function(msg) {
  for (const key of Object.keys(msg.args)) {
    // Convert string args to a dict
    if (typeof msg.args[key] !== 'object') {
      msg.args[key] = {
        value: msg.args[key],
      }
    }
  }
}

// To be overridden if automatic transition logging is desired.
function stateLogger(name, data) {
  /* if (!data) {
   *   data = {}
   * }

   * const entry = {
   *   template: '{transition}',
   *   classes: ['game-transition'],
   *   args: {
   *     transition: name,
   *   }
   * }

   * if (data.playerName) {
   *   entry.template += ' ({player})'
   *   entry.args.player = data.playerName
   * }

   * this.mLog(entry) */
}
