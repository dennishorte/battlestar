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

  // The branch id is used when saving the game to see if another player has taken an
  // action since this game was loaded.
  this.branchId = serialized_data.branchId

  // Settings are immutable data
  this.settings = serialized_data.settings

  // Responses are the history of choices made by users.
  // This should never be reset.
  this.responses = serialized_data.responses
  this.usedUndo = false

  // Chat is separate from the game history.
  this.chat = serialized_data.chat || []

  // This holds a reference to the latest input request
  this.waiting = null

  // Places where extra code can be inserted for testing.
  this.breakpoints = {}

  this.gameOver = false
  this.gameOverData = null
  this.random = 'uninitialized'

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
    gameId: this._id,
    settings: this.settings,
    responses: this.responses,
    branchId: this.branchId,
    chat: this.chat,
  }
}


////////////////////////////////////////////////////////////////////////////////
// Input Requests / Responses

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
  return this.getPlayerByName(this.viewerName)
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
      this.getLog().push({
        type: 'response-received',
        data: resp,
      })
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
      this.getLog().push({
        type: 'response-received',
        data: input,
      })
    }
  }

  while (responses.length < array.length) {
    const resp = this._getResponse()

    if (resp) {
      if (resp.type === 'chat') {
        const player = this.getPlayerByName(resp.actor)
        this.getLog().push({
          author: resp.actor,
          text: resp.text,
          type: 'chat'
        })
      }
      else {
        __prepareInput(resp)
      }
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

  try {
    return this.run()
  }
  catch (e) {
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
      this.waiting = e
      return e
    }
    else if (e instanceof GameOverEvent) {
      // Some games, such as Innovation, can alter the outcome of a game over event based on
      // board conditions. (eg. Jackie Chan in Innovation)
      const result = this._gameOver(e)

      this.gameOver = true
      this.gameOverData = result.data

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
  this.usedUndo = true
  this.run()

  // Update the chat indices so that they are no bigger than the length of the log.
  const logLength = this.getLog().length
  for (const chat of this.chat) {
    if (chat.position > logLength) {
      chat.position = logLength
    }
  }

  return '__SUCCESS__'
}


////////////////////////////////////////////////////////////////////////////////
// Chat and Logging

Game.prototype.deleteChatById = function(id) {
  const index = this.chat.findIndex(c => c.id === id)
  this.chat.splice(index, 1)
}

Game.prototype.getNewChatCount = function(playerOrName) {
  const playerName = playerOrName.name ? playerOrName.name : playerOrName

  // See if any chats exist before the last response of this player.
  // If yes, assume they are new.
  const rlog = [...this.getMergedLog()].reverse()

  let count = 0

  for (const msg of rlog) {
    if (msg.type === 'response-received' && msg.data.actor === playerName) {
      return count
    }

    if (msg.type === 'chat' && msg.author !== playerName) {
      count += 1
    }
  }

  return count
}

Game.prototype.getChat = function() {
  return this.chat
},

Game.prototype.getLog = function() {
  return this.state.log
}

Game.prototype.getLogIndent = function() {
  return this.state.indent
}

Game.prototype.getMergedLog = function() {
  const log = this.getLog()
  const chat = this.getChat()

  if (chat.length === 0) {
    return log
  }

  const output = []

  let chatIndex = 0
  let logIndex = 0

  for (; logIndex < log.length; logIndex++) {
    output.push(log[logIndex])

    while (chat[chatIndex] && chat[chatIndex].position === logIndex) {
      output.push(chat[chatIndex])
      chatIndex += 1
    }
  }

  while (chatIndex < chat.length) {
    output.push(chat[chatIndex])
    chatIndex += 1
  }

  return output
}

Game.prototype.getViewerName = function() {
  return this.viewerName
}

Game.prototype.mChat = function(playerName, text) {
  this.chat.push({
    id: Date.now(),
    author: playerName,
    position: this.getLog().length,
    text,
    type: 'chat',
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
  msg.indent = this.getLogIndent()

  // Making a copy here makes sure that the log items are always distinct from
  // wherever their original data came from.
  this.getLog().push(msg)

  return msg.id
}

Game.prototype.mLogIndent = function() {
  this.state.indent += 1
}

Game.prototype.mLogSetIndent = function(count) {
  while (this.state.indent < count) {
    this.mLogIndent()
  }
  while (this.state.indent > count) {
    this.mLogOutdent()
  }
}

Game.prototype.mLogOutdent = function() {
  if (this.indent === 0) {
    throw new Error('Cannot outdent; indent is already 0.')
  }
  this.state.indent -= 1
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
    indent: 0,
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
// Standard game methods


Game.prototype.aChoose = function(player, choices, opts={}) {
  if (choices.length === 0) {
    this.mLogNoEffect()
    return []
  }

  const chooseSelector = {
    actor: player.name,
    title: opts.title || 'Choose',
    choices: choices,
    ...opts
  }

  const selected = this.requestInputSingle(chooseSelector)

  // Validate counts
  const { min, max } = selector.minMax(chooseSelector)

  if (selected.length < min || selected.length > max) {
    throw new Error('Invalid number of options selected')
  }

  if (selected.length === 0) {
    this.mLogDoNothing(player)
    return []
  }
  else {
    return selected
  }

}

Game.prototype.aChooseYesNo = function(player, title) {
  const choice = this.aChoose(player, ['yes', 'no'], { title })
  return choice[0] === 'yes'
}

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

Game.prototype.getPlayerByOwner = function(card) {
  return card.owner
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

Game.prototype.getPlayerFollowing = function(player) {
  return this
    .getPlayersEnding(player)
    .filter(player => !player.dead)[0]
}

Game.prototype.getPlayerPreceding = function(player) {
  return this
    .getPlayersStarting(player)
    .filter(player => !player.dead)
    .slice(-1)[0]
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

Game.prototype.getZoneByCard = function(card) {
  return this.getZoneById(card.zone)
}

Game.prototype.getZoneByCardHome = function(card) {
  return this.getZoneById(card.home)
}

Game.prototype.getZoneById = function(id) {
  const tokens = id.split('.')
  let curr = this.state.zones
  for (const token of tokens) {
    util.assert(curr.hasOwnProperty(token), `Invalid zone id ${id} at token ${token}`)
    curr = curr[token]
  }
  return curr
}

Game.prototype.getZoneByPlayer = function(player, name) {
  return this.state.zones.players[player.name][name]
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
  card.zone = target.id

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
    this.mLog({
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
