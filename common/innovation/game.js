const seedrandom = require('seedrandom')
const selector = require('./selector.js')
const util = require('./util.js')

module.exports = {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
}


function Game(serialized_data) {
  // State will be reset each time the game is run
  this.state = this._blankState()

  // Settings are immutable data
  this.settings = serialized_data.settings

  // Responses are the history of choices made by users.
  // This should never be reset.
  this.responses = serialized_data.responses

  // Places where extra code can be inserted for testing.
  this.breakpoints = {}

  this.random = 'uninitialized'
  this.key = 'uninitialized'
}

function GameFactory(settings) {
  settings = Object.assign({
    name: '',
    players: [],
    seed: '',
  }, settings)

  util.assert(settings.players.length > 0)
  util.assert(settings.name.length > 0)
  util.assert(settings.seed !== '')

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
    /* console.log(JSON.stringify({
     *   request,
     *   response,
     *   result,
     * }, null, 2)) */
    throw new Error('Invalid response')
  }
}

Game.prototype.requestInputMany = function(array) {
  if (!Array.isArray(array)) {
    array = [array]
  }

  const responses = []
  while (responses.length < array.length) {
    const resp = this._getResponse()
    if (responseIsDuplicate(responses, resp)) {
      throw new DuplicateResponseError(`Duplicate response from ${resp.actor}`)
    }
    else if (resp) {
      this._validateResponse(array, resp)
      responses.push(resp)
    }
    else {
      const unanswered = array.filter(request => !responses.find(r => r.actor === request.actor))
      const answer = this._tryToAutomaticallyRespond(unanswered)
      if (answer) {
        this._validateResponse(array, answer)
        this.responses.push(answer)
        responses.push(answer)
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
  const t = require('./testutil.js')

  util.assert(response.key === this.key, "Invalid response. State has updated.")
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
      e.key = this._setInputRequestKey()
      return e
    }
    else if (e instanceof GameOverEvent) {
      return this._gameOver(e)
    }
    else {
      throw e
    }
  }
}

Game.prototype.undo = function() {
  // First, see if there is response from this user to the current request key.
  if (this._undoMostRecent(this.key)) {
    return
  }

  // Second, see if there is a response from this user to the most recent response's key.
  // Sometimes this is the same as above, but usually it is different.
  if (this._undoMostRecent(this.responses[this.responses.length - 1].key)) {
    return
  }

  // Undo all responses to the last submitted key.
  const latest = util.array.takeRightWhile(this.responses, resp => resp.key === lastKey)
  for (let i = 0; i < latest.length; i++) {
    this.responses.pop()
  }
}

Game.prototype._undoMostRecent = function(key) {
  const recentResponses = util.array.takeRightWhile(this.responses, resp => resp.key === key)
  const recentMatch = currentResponses.find(resp => resp.actor === this.viewerName)
  if (recentMatch) {
    const index = this.responses.findIndex(resp => resp === recentMatch)
    this.responses.splice(index, 1)
    return true
  }
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
