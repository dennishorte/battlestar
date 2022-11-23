const seedrandom = require('seedrandom')
const selector = require('./selector.js')
const util = require('./util.js')

module.exports = {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
}


function Game(serialized_data, viewerName) {
  this._id = serialized_data._id

  // State will be reset each time the game is run
  this.state = this._blankState()
  this.chat = serialized_data.chat || []

  // Settings are immutable data
  this.settings = serialized_data.settings

  // Responses are the history of choices made by users.
  // This should never be reset.
  this.responses = serialized_data.responses
  this.usedUndo = false

  // This holds a reference to the latest input request
  this.waiting = null

  // Places where extra code can be inserted for testing.
  this.breakpoints = {}

  this.gameOver = false
  this.random = 'uninitialized'
  this.key = 'uninitialized'

  this.viewerName = viewerName
}

function GameFactory(settings, viewerName=undefined) {
  settings = Object.assign({
    game: '',
    name: '',
    players: [],
    seed: '',
  }, settings)

  if (!settings.seed) {
    settings.seed = settings.name
  }

  util.assert(settings.players.length > 0)
  util.assert(settings.name.length > 0)
  util.assert(!!settings.seed)

  const data = {
    chat: [],
    responses: [],
    settings,
  }

  return new Game(data, viewerName)
}

function GameOverEvent(data) {
  this.data = data
}

function InputRequestEvent(selectors) {
  if (!Array.isArray(selectors)) {
    selectors = [selectors]
  }
  this.selectors = selectors
}

Game.prototype.serialize = function() {
  return {
    settings: this.settings,
    responses: this.responses,
  }
}


////////////////////////////////////////////////////////////////////////////////
// Custom Errors

util.inherit(Error, DuplicateResponseError)
function DuplicateResponseError(msg) {
  Error.call(this, msg)
}


////////////////////////////////////////////////////////////////////////////////
// Input Requests / Responses

Game.prototype._validateResponse = function(requests, response) {
  const request = requests.find(r => r.actor === response.actor)
  util.assert(request !== undefined, "No request matches the response actor")

  const result = selector.validate(request, response, { ignoreTitle: true })
  if (!result.valid) {
    /* console.log(JSON.stringify({
     *   request,
     *   response,
     *   result,
     * }, null, 2)) */
    throw new Error('Invalid response')
  }
}

Game.prototype.checkGameIsOver = function() {
  return this.gameOver
}

Game.prototype.checkLastActorWas = function(player) {
  const lastAction = this.getLastUserAction()
  if (!lastAction) {
    return false
  }

  else {
    return lastAction.actor === player.name
  }
}

Game.prototype.checkPlayerHasActionWaiting = function(player) {
  return !!this.getWaiting(player)
}

Game.prototype.getLastUserAction = function(player) {
  const copy = [...this.responses]
  while (copy.length > 0 && !copy[copy.length - 1].isUserResponse) {
    copy.pop()
  }
  return copy[copy.length - 1]
}

Game.prototype.getPlayerNamesWaiting = function() {
  if (!this.waiting) {
    return []
  }
  else {
    return this.waiting.selectors.map(s => s.actor)
  }
}

Game.prototype.getWaiting = function(player) {
  if (!this.waiting) {
    return undefined
  }
  else if (player) {
    return this.waiting.selectors.find(s => s.actor === player.name)
  }
  else {
    return this.waiting
  }
}

Game.prototype.getWaitingKey = function() {
  return this.waiting ? this.waiting.key : undefined
}

Game.prototype.requestInputMany = function(array) {
  this.key = this._setInputRequestKey()

  if (!Array.isArray(array)) {
    array = [array]
  }

  const responses = []
  const __prepareInput = (input) => {
    responses.push(input)
    if (input.isUserResponse) {
      this.getLog().push({
        type: 'response-received',
        data: input,
      })
    }
    this._responseReceived(input)
  }

  while (responses.length < array.length) {
    const resp = this._getResponse()
    if (responseIsDuplicate(responses, resp)) {
      throw new DuplicateResponseError(`Duplicate response from ${resp.actor}`)
    }
    else if (resp) {
      this._validateResponse(array, resp)
      __prepareInput(resp)
    }
    else {
      const unanswered = array.filter(request => !responses.find(r => r.actor === request.actor))
      const answer = this._tryToAutomaticallyRespond(unanswered)
      if (answer) {
        this._validateResponse(array, answer)
        this.responses.push(answer)
        __prepareInput(answer)
      }
      else {
	throw new InputRequestEvent(unanswered)
      }
    }
  }
  return responses
}

Game.prototype.requestInputSingle = function(selector) {
  const results = this.requestInputMany([selector])
  util.assert(results.length === 1, `Got back ${results.length} responses from requestInputSingle.`)
  return results[0].selection
}

Game.prototype.respondToInputRequest = function(response) {
  util.assert(response.key === this.key, `Invalid response. State has updated. this: ${this.key} resp: ${response.key}`)

  response.isUserResponse = true  // As opposed to an automated response.
  this.responses.push(response)

  try {
    return this.run()
  }
  catch (e) {
    if (e instanceof DuplicateResponseError) {
      this.responses.pop()
    }
    throw e
  }
}

Game.prototype.run = function() {
  try {
    this._reset()
    this._mainProgram()
  }
  catch (e) {
    if (e instanceof InputRequestEvent) {
      e.key = this.key
      this.waiting = e
      return e
    }
    else if (e instanceof GameOverEvent) {
      this.gameOver = true
      return this._gameOver(e)
    }
    else {
      throw e
    }
  }
}

Game.prototype.undo = function() {
  this.usedUndo = true

  if (this.gameOver) {
    this.gameOver = false
  }

  // Undo all responses to the last submitted key.
  while (!this.responses[this.responses.length - 1].isUserResponse) {
    this.responses.pop()
  }
  this.responses.pop()

  this._undoCalled()

  this.run()

  for (const chat of this.getChat()) {
    if (chat.position > this.getLog().length) {
      chat.position = this.getLog().length
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Logging

Game.prototype.getChat = function() {
  return this.chat
}

Game.prototype.getLog = function() {
  return this.state.log
}

Game.prototype.getLogIndent = function(msg) {
  let indent = 0
  for (const msg of this.getLog()) {
    if (msg === '__INDENT__') {
      indent += 1
    }
    else if (msg === '__OUTDENT__') {
      indent -= 1
    }
  }
  return indent
}

Game.prototype.getViewerName = function() {
  return this.viewerName
}

Game.prototype.mChat = function(player, text) {
  player = player.name ? player.name : player
  util.assert(typeof player === 'string', "Player param is not a string")

  this.getChat().push({
    player,
    text,

    // The position is used to interleave chat with the log messages, if desired.
    position: this.getLog().length
  })
}

Game.prototype.mLog = function(msg) {
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

  this._enrichLogArgs(msg)

  if (this._postEnrichArgs(msg)) {
    return
  }

  msg.id = this.getLog().length
  msg.indent = this.getLogIndent(msg)

  // Making a copy here makes sure that the log items are always distinct from
  // wherever their original data came from.
  this.getLog().push(msg)

  return msg.id
}

Game.prototype.mLogIndent = function() {
  this.getLog().push('__INDENT__')
}

Game.prototype.mLogOutdent = function() {
  this.getLog().push('__OUTDENT__')
}

Game.prototype.mLogDoNothing = function(player) {
  this.mLog({
    template: '{player} does nothing',
    args: { player }
  })
}

Game.prototype.mLogNoEffect = function() {
  this.mLog({ template: 'no effect' })
}


////////////////////////////////////////////////////////////////////////////////
// Protected Methods

Game.prototype._gameOver = function(e) {
  throw new Error('Please implement _gameOver')
}

Game.prototype._mainProgram = function() {
  throw new Error('Please implement _mainProgram')
}

Game.prototype._blankState = function(more = {}) {
  return Object.assign({
    log: [],
    responseIndex: -1,
  }, more)
}

Game.prototype._responseReceived = function(response) {
  // To be overridden by child classes.
}

Game.prototype._enrichLogArgs = function(msg) {
  // To be overridden by child classes.
}

Game.prototype._postEnrichArgs = function(msg) {
  // To be overridden by child classes.
}

Game.prototype._undoCalled = function() {
  // To be overridden by child classes.
}

////////////////////////////////////////////////////////////////////////////////
// Private Methods

Game.prototype._breakpoint = function(name) {
  const callbacks = this.breakpoints[name] || []
  for (const callback of callbacks) {
    callback(this)
  }
}

Game.prototype._getResponse = function() {
  this.state.responseIndex += 1
  return this.responses[this.state.responseIndex]
}

// When overriding, always call super before doing any additional state updates.
Game.prototype._reset = function() {
  this.key = 0
  this.random = seedrandom(this.settings.seed)
  this.state = this._blankState()
}

Game.prototype._setInputRequestKey = function() {
  this.key = this.random.int32()
  return this.key
}

Game.prototype._tryToAutomaticallyRespond = function(selectors) {
  for (const sel of selectors) {

    // This is a special key to say that there is no fixed response expected
    // so cannot automatically respond. Used in games like Magic where the
    // user input is very freeform.
    if (sel.choices === '__UNSPECIFIED__') {
      return undefined
    }

    // Don't try to understand nested structures.
    for (const choice of sel.choices) {
      if (choice.choices) {
        return undefined
      }
    }

    const { min, max } = selector.minMax(sel)

    if (min >= sel.choices.length) {
      const response = {
        actor: sel.actor,
        title: sel.title,
        selection: [...sel.choices],
      }

      // Rename choices to selection down to one lower level.
      for (const x of response.selection) {
        if (x.choices) {
          x.selection = x.choices
          delete x.choices
        }
      }

      return response
    }
  }

  return undefined
}


////////////////////////////////////////////////////////////////////////////////
// Test only methods

Game.prototype.testSetBreakpoint = function(name, fn) {
  if (this.breakpoints.hasOwnProperty(name)) {
    this.breakpoints[name].push(fn)
  }
  else {
    this.breakpoints[name] = [fn]
  }
}


////////////////////////////////////////////////////////////////////////////////
// non-class methods

function responseIsDuplicate(responses, r) {
  if (!r) {
    return false
  }

  const possibleDuplicates = util.array.takeRightWhile(responses, x => x.key === r.key)
  return possibleDuplicates.some(x => x.actor === r.actor)
}


////////////////////////////////////////////////////////////////////////////////
// Standard game methods

Game.prototype.checkSameTeam = function(p1, p2) {
  return p1.team === p2.team
}

Game.prototype.getCardsByZone = function(player, zoneName) {
  return this.getZoneByPlayer(player, zoneName).cards()
}

Game.prototype.getPlayerAll = function() {
  return this.state.players
}

Game.prototype.getPlayerOther = function(player) {
  return this
    .getPlayerAll()
    .filter(other => other !== player)
}

Game.prototype.getPlayerByName = function(name) {
  return this.getPlayerAll().find(p => p.name === name)
}

Game.prototype.getPlayerByZone = function(zone) {
  const regex = /players[.]([^.]+)[.]/
  const match = zone.id.match(regex)

  if (match) {
    return this.getPlayerByName(match[1])
  }
  else {
    return undefined
  }
}

Game.prototype.getPlayerCurrent = function() {
  return this.state.currentPlayer
}

Game.prototype.getPlayerFirst = function() {
  return this.getPlayerAll()[0]
}

Game.prototype.getPlayerNext = function() {
  return this
    .getPlayersEnding(this.getPlayerCurrent())
    .filter(player => !player.dead)[0]
}

Game.prototype.getPlayerOpponents = function(player) {
  return this
    .getPlayerAll()
    .filter(p => !this.checkSameTeam(p, player))
}

Game.prototype.getPlayersEnding = function(player) {
  const players = [...this.getPlayerAll()]
  while (players[players.length - 1] !== player) {
    players.push(players.shift())
  }
  return players
}

Game.prototype.getPlayersStarting = function(player) {
  const players = [...this.getPlayerAll()]
  while (players[0] !== player) {
    players.push(players.shift())
  }
  return players
}

// Return an array of all players, starting with the current player.
Game.prototype.getPlayersStartingCurrent = function() {
  return this.getPlayersStarting(this.getPlayerCurrent())
}

// Return an array of all players, starting with the player who will follow the current player.
// Commonly used when evaluating effects
Game.prototype.getPlayersStartingNext = function() {
  return this.getPlayersStarting(this.getPlayerNext())
}

Game.prototype.getZoneByPlayer = function(player, name) {
  return this.state.zones.players[player.name][name]
}
