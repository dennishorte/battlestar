const seedrandom = require('seedrandom')
const selector = require('../lib/selector.js')
const util = require('../lib/util.js')

module.exports = {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
}


function Game(serialized_data) {
  this._id = serialized_data._id

  // State will be reset each time the game is run
  this.state = this._blankState()

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
}

function GameFactory(settings) {
  settings = Object.assign({
    game: 'Innovation',
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
    responses: [],
    settings,
  }

  return new Game(data)
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

  const result = selector.validate(request, response)
  if (!result.valid) {
    console.log(JSON.stringify({
      request,
      response,
      result,
    }, null, 2))
    throw new Error('Invalid response')
  }
}

Game.prototype.checkGameIsOver = function() {
  return this.gameOver
}

Game.prototype.checkPlayerHasActionWaiting = function(player) {
  return !!this.getWaiting(player)
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

  // Undo all responses to the last submitted key.
  while (!this.responses[this.responses.length - 1].isUserResponse) {
    this.responses.pop()
  }
  this.responses.pop()
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
    const { min, max } = selector.minMax(sel)
    if (min >= sel.choices.length) {
      const response = {
        actor: sel.actor,
        title: sel.title,
        selection: sel.choices,
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
