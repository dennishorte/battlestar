const seedrandom = require('seedrandom')
const selector = require('./selector.js')
const util = require('./util.js')

const {
  BaseActionManager,
  BaseCardManager,
  BaseLogManager,
  BasePlayerManager,
  BaseZoneManager,
} = require('./game/index.js')

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

  // The branch id is used when saving the game to see if another player has taken an
  // action since this game was loaded.
  this.branchId = serialized_data.branchId

  // Settings are immutable data
  this.settings = serialized_data.settings

  // Responses are the history of choices made by users.
  // This should never be reset.
  this.responses = serialized_data.responses
  this.undoCount = 0

  // This holds a reference to the latest input request
  this.waiting = null

  // Places where extra code can be inserted for testing.
  this.breakpoints = {}

  this.gameOver = false
  this.gameOverData = null
  this.random = seedrandom(this.settings.seed)

  this.viewerName = viewerName

  // Add log first so that when the later managers are loaded, they can initialize the log internally.
  this.log = new BaseLogManager(this, serialized_data.chat, viewerName)
  this.actions = new BaseActionManager(this)
  this.cards = new BaseCardManager(this)
  this.players = new BasePlayerManager(this, this.settings.players, this.settings.playerOptions || {})
  this.zones = new BaseZoneManager(this)
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
    _id: this._id,
    gameId: this._id,
    settings: this.settings,
    responses: this.responses,
    branchId: this.branchId,
    chat: this.log.getChat(),
  }
}


////////////////////////////////////////////////////////////////////////////////
// Input Requests / Responses

Game.prototype.checkIsNewGame = function() {
  return this.responses.length === 0
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

Game.prototype.getLastActorId = function() {
  const action = this.getLastUserAction()
  return this.settings.players.find(user => user.name === action.actor)._id
}

Game.prototype.getLastUserAction = function() {
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

Game.prototype.getPlayerViewer = function() {
  return this.players.byName(this.viewerName)
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

// Intended for use in Magic Drafts, this allows any player to send an input request.
Game.prototype.requestInputAny = function(array) {
  if (!Array.isArray(array)) {
    array = [array]
  }

  const resp = this._getResponse() // || this._tryToAutomaticallyRespond(array)

  if (resp) {
    if (resp.isUserResponse) {
      this.log.responseReceived(resp)
    }
    return resp
  }
  else {
    throw new InputRequestEvent(array)
  }
}

Game.prototype.requestInputMany = function(array) {
  if (!Array.isArray(array)) {
    array = [array]
  }

  const responses = []
  const __prepareInput = (input) => {
    responses.push(input)
    if (input.isUserResponse) {
      this.log.responseReceived(input)
    }
  }

  while (responses.length < array.length) {
    const resp = this._getResponse()

    if (resp) {
      __prepareInput(resp)
    }
    else {
      const unanswered = array.filter(request => !responses.find(r => r.actor === request.actor))
      const answer = this._tryToAutomaticallyRespond(unanswered)
      if (answer) {
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
  this._responseReceived(response)

  response.isUserResponse = true  // As opposed to an automated response.
  this.responses.push(response)

  return this.run()
}

Game.prototype.run = function() {
  try {
    this._reset()
    this._mainProgram()
  }
  catch (e) {
    if (e instanceof InputRequestEvent) {
      this.waiting = e
      return e
    }
    else if (e instanceof GameOverEvent) {
      // Some games, such as Innovation, can alter the outcome of a game over event based on
      // board conditions. (eg. Jackie Chan in Innovation)
      const result = this._gameOver(e)

      this.gameOver = true
      this.gameOverData = result.data
      if (result.data.player && result.data.player.name) {
        this.gameOverData.player = this.gameOverData.player.name
      }

      this.log.add({ template: this.getResultMessage() })

      return result
    }
    else {
      throw e
    }
  }
}

Game.prototype.undo = function() {
  if (this.gameOver) {
    this.gameOver = false
    this.gameOverData = null
  }

  const responsesCopy = [...this.responses]

  while (true) {
    // We didn't find anything that could be undone.
    if (responsesCopy.length === 0) {
      return '__NO_MORE_ACTIONS__'
    }

    const next = responsesCopy.pop()

    // Some things can't be undone.
    // Games can insert special events into the responses object that
    if (next.noUndo) {
      return '__NO_UNDO__'
    }

    // We undid an actual user response, rather than some automated action,
    // so we have completed the undo action.
    if (next.isUserResponse) {
      break
    }
  }

  this.responses = responsesCopy
  this.undoCount += 1
  this.run()

  // Ensure that the chat indices are no larger than the length of the log.
  this.log.reindexChat()

  return '__SUCCESS__'
}


////////////////////////////////////////////////////////////////////////////////
// Chat and Logging

Game.prototype.getResultMessage = function() {
  if (this.checkGameIsOver()) {
    const player = this.gameOverData.player
    const winnerName = player.name ? player.name : player
    const reason = this.gameOverData.reason
    return `${winnerName} wins due to ${reason}`
  }
  else {
    return 'in progress'
  }
}

Game.prototype.getViewerName = function() {
  return this.viewerName
}


////////////////////////////////////////////////////////////////////////////////
// Protected Methods

Game.prototype._gameOver = function(event) {
  this.log.setIndent(0)
  return event
}

Game.prototype._mainProgram = function() {
  throw new Error('Please implement _mainProgram')
}

Game.prototype._blankState = function(more = {}) {
  return Object.assign({
    indent: 0,
    responseIndex: -1,
  }, more)
}

// eslint-disable-next-line
Game.prototype._responseReceived = function(response) {
  // To be overridden by child classes.
}

Game.prototype._undoCalled = function() {
  // To be overridden by child classes.
}

// eslint-disable-next-line
Game.prototype._cardMovedCallback = function(card) {
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
  this.random = seedrandom(this.settings.seed)
  this.state = this._blankState()
  this.log.reset()
  this.players.reset()
  this.cards.reset()
  this.zones.reset()
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

    const { min } = selector.minMax(sel)

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
  if (Object.hasOwn(this.breakpoints, name)) {
    this.breakpoints[name].push(fn)
  }
  else {
    this.breakpoints[name] = [fn]
  }
}


////////////////////////////////////////////////////////////////////////////////
// Standard game methods


Game.prototype.checkSameTeam = function(p1, p2) {
  return p1.team === p2.team
}

Game.prototype.getCardsByZone = function(player, zoneName) {
  return this.zones.byPlayer(player, zoneName).cards()
}

Game.prototype.getZoneByCard = function(card) {
  if (card.g && card.g.zone) {
    return this.zones.byId(card.g.zone)
  }
  else {
    return card.zone
  }
}

Game.prototype.getZoneByCardHome = function(card) {
  if (card.g && card.g.home) {
    return this.zones.byId(card.g.home)
  }
  else {
    return this.zones.byId(card.home)
  }
}

////////////////////////////////////////////////////////////////////////////////
// State modifying functions

Game.prototype.mMoveByIndices = function(source, sourceIndex, target, targetIndex) {
  util.assert(sourceIndex >= 0 && sourceIndex <= source.cards().length - 1, `Invalid source index ${sourceIndex}`)

  const sourceCards = source._cards
  const targetCards = target._cards
  const card = sourceCards[sourceIndex]
  sourceCards.splice(sourceIndex, 1)
  targetCards.splice(targetIndex, 0, card)
  card.zone = target

  this._cardMovedCallback({
    card,
    sourceZone: source,
    targetZone: target,
  })
  return card
}

Game.prototype.mMoveCardTo = function(card, zone, opts={}) {
  const source = this.getZoneByCard(card)
  const index = source.cards().indexOf(card)
  const destIndex = opts.index !== undefined ? opts.index : zone.cards().length
  if (opts.verbose) {
    this.log.add({
      template: 'Moving {card} to {zone} at index {index}',
      args: { card, zone, index: destIndex }
    })
  }
  this.mMoveByIndices(source, index, zone, destIndex)
}


////////////////////////////////////////////////////////////////////////////////
// Specialty functions

Game.prototype.historicalView = function(index) {
  const data = {
    _id: this._id,
    settings: this.settings,
    responses: this.responses.slice(0, index + 1),
  }

  return new this.constructor(data, this.viewerName)
}
