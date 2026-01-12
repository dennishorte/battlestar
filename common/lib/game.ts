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

interface PlayerData {
  _id: string
  name: string
  [key: string]: unknown
}

interface GameSettings {
  game: string
  name: string
  players: PlayerData[]
  seed: string
  playerOptions?: Record<string, unknown>
  [key: string]: unknown
}

interface SerializedGame {
  _id?: string
  gameId?: string
  settings: GameSettings
  responses: Response[]
  branchId?: string
  chat?: Chat[]
}

interface Response {
  actor: string
  title?: string
  selection?: unknown[]
  isUserResponse?: boolean
  noUndo?: boolean
  [key: string]: unknown
}

interface Chat {
  author: string
  text: string
  position: number
  [key: string]: unknown
}

interface GameState {
  indent: number
  responseIndex: number
  [key: string]: unknown
}

interface SelectorInput {
  actor: string
  title?: string
  choices: unknown[] | '__UNSPECIFIED__'
  min?: number
  max?: number
  count?: number
  [key: string]: unknown
}

interface GameOverData {
  player?: { name: string } | string
  reason: string
  [key: string]: unknown
}

interface GameOptions {
  LogManager?: typeof BaseLogManager
  ActionManager?: typeof BaseActionManager
  CardManager?: typeof BaseCardManager
  PlayerManager?: typeof BasePlayerManager
  ZoneManager?: typeof BaseZoneManager
  [key: string]: unknown
}

interface InputRequestEventInstance {
  selectors: SelectorInput[]
}

interface GameOverEventInstance {
  data: GameOverData
}

interface Game {
  _id: string | undefined
  state: GameState
  branchId: string | undefined
  settings: GameSettings
  responses: Response[]
  undoCount: number
  waiting: InputRequestEventInstance | null
  breakpoints: Record<string, ((game: Game) => void)[]>
  gameOver: boolean
  gameOverData: GameOverData | null
  random: () => number
  viewerName: string | undefined
  log: InstanceType<typeof BaseLogManager>
  actions: InstanceType<typeof BaseActionManager>
  cards: InstanceType<typeof BaseCardManager>
  players: InstanceType<typeof BasePlayerManager>
  zones: InstanceType<typeof BaseZoneManager>
  constructor: GameConstructor

  // Methods
  serialize(): SerializedGame
  checkIsNewGame(): boolean
  checkGameIsOver(): boolean
  checkLastActorWas(player: { name: string }): boolean
  checkPlayerHasActionWaiting(player: { name: string }): boolean
  getLastActorId(): string
  getLastUserAction(): Response | undefined
  getPlayerNamesWaiting(): string[]
  getPlayerViewer(): unknown
  getWaiting(player?: { name: string }): SelectorInput | InputRequestEventInstance | undefined
  requestInputAny(array: SelectorInput | SelectorInput[]): Response
  requestInputMany(array: SelectorInput | SelectorInput[]): Response[]
  requestInputSingle(selector: SelectorInput): unknown[]
  respondToInputRequest(response: Response): unknown
  run(): unknown
  undo(): '__NO_MORE_ACTIONS__' | '__NO_UNDO__' | '__SUCCESS__'
  youWin(player: { name: string }, reason: string): never
  getResultMessage(): string
  getViewerName(): string | undefined
  _gameOver(event: GameOverEventInstance): GameOverEventInstance
  _mainProgram(): void
  _blankState(more?: Record<string, unknown>): GameState
  _responseReceived(response: Response): void
  _undoCalled(): void
  _cardMovedCallback(card: unknown): void
  _breakpoint(name: string): void
  _getResponse(): Response | undefined
  _reset(): void
  _tryToAutomaticallyRespond(selectors: SelectorInput[]): Response | undefined
  testSetBreakpoint(name: string, fn: (game: Game) => void): void
  checkSameTeam(p1: { team: string }, p2: { team: string }): boolean
  historicalView(index: number): Game
}

interface GameConstructor {
  new(data: SerializedGame, viewerName?: string, opts?: GameOptions): Game
  prototype: Game
}

function GameOverEvent(this: { data: GameOverData }, data: GameOverData): void {
  this.data = data
}

function InputRequestEvent(this: { selectors: SelectorInput[] }, selectors: SelectorInput | SelectorInput[]): void {
  if (!Array.isArray(selectors)) {
    selectors = [selectors]
  }
  this.selectors = selectors
}

function Game(this: Game, serialized_data: SerializedGame, viewerName?: string, opts: GameOptions = {}): void {
  opts = Object.assign({
    LogManager: BaseLogManager,
    ActionManager: BaseActionManager,
    CardManager: BaseCardManager,
    PlayerManager: BasePlayerManager,
    ZoneManager: BaseZoneManager,
  }, opts)

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
  this.log = new opts.LogManager!(this, serialized_data.chat, viewerName)
  this.actions = new opts.ActionManager!(this)
  this.cards = new opts.CardManager!(this)
  this.players = new opts.PlayerManager!(this, this.settings.players, this.settings.playerOptions || {})
  this.zones = new opts.ZoneManager!(this)
}

function GameFactory(settings: Partial<GameSettings>, viewerName?: string): Game {
  const fullSettings: GameSettings = Object.assign({
    game: '',
    name: '',
    players: [],
    seed: '',
  }, settings) as GameSettings

  if (!fullSettings.seed) {
    fullSettings.seed = fullSettings.name
  }

  util.assert(fullSettings.players.length > 0)
  util.assert(fullSettings.name.length > 0)
  util.assert(!!fullSettings.seed)

  const data: SerializedGame = {
    responses: [],
    settings: fullSettings,
  }

  return new (Game as unknown as new (data: SerializedGame, viewerName?: string) => Game)(data, viewerName)
}

Game.prototype.serialize = function(this: Game): SerializedGame {
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

Game.prototype.checkIsNewGame = function(this: Game): boolean {
  return this.responses.length === 0
}

Game.prototype.checkGameIsOver = function(this: Game): boolean {
  return this.gameOver
}

Game.prototype.checkLastActorWas = function(this: Game, player: { name: string }): boolean {
  const lastAction = this.getLastUserAction()
  if (!lastAction) {
    return false
  }

  else {
    return lastAction.actor === player.name
  }
}

Game.prototype.checkPlayerHasActionWaiting = function(this: Game, player: { name: string }): boolean {
  return !!this.getWaiting(player)
}

Game.prototype.getLastActorId = function(this: Game): string {
  const action = this.getLastUserAction()
  return this.settings.players.find(user => user.name === action!.actor)!._id
}

Game.prototype.getLastUserAction = function(this: Game): Response | undefined {
  const copy = [...this.responses]
  while (copy.length > 0 && !copy[copy.length - 1].isUserResponse) {
    copy.pop()
  }
  return copy[copy.length - 1]
}

Game.prototype.getPlayerNamesWaiting = function(this: Game): string[] {
  if (!this.waiting) {
    return []
  }
  else {
    return this.waiting.selectors.map(s => s.actor)
  }
}

Game.prototype.getPlayerViewer = function(this: Game): unknown {
  return this.players.byName(this.viewerName)
}

Game.prototype.getWaiting = function(this: Game, player?: { name: string }): SelectorInput | InputRequestEventInstance | undefined {
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
Game.prototype.requestInputAny = function(this: Game, array: SelectorInput | SelectorInput[]): Response {
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
    throw new (InputRequestEvent as unknown as new (selectors: SelectorInput[]) => { selectors: SelectorInput[] })(array)
  }
}

/**
 * Requests input from one or more players. Blocks until all players have responded,
 * or throws an InputRequestEvent if responses are not available.
 */
Game.prototype.requestInputMany = function(this: Game, array: SelectorInput | SelectorInput[]): Response[] {
  if (!Array.isArray(array)) {
    array = [array]
  }

  const responses: Response[] = []
  const __prepareInput = (input: Response): void => {
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
        throw new (InputRequestEvent as unknown as new (selectors: SelectorInput[]) => { selectors: SelectorInput[] })(unanswered)
      }
    }
  }

  return responses
}

Game.prototype.requestInputSingle = function(this: Game, selectorInput: SelectorInput): unknown[] {
  const results = this.requestInputMany([selectorInput])
  util.assert(results.length === 1, `Got back ${results.length} responses from requestInputSingle.`)
  return results[0].selection!
}

Game.prototype.respondToInputRequest = function(this: Game, response: Response): unknown {
  this._responseReceived(response)

  response.isUserResponse = true  // As opposed to an automated response.
  this.responses.push(response)

  return this.run()
}

Game.prototype.run = function(this: Game): unknown {
  try {
    this._reset()
    this._mainProgram()
  }
  catch (e) {
    if (e instanceof InputRequestEvent) {
      this.waiting = e as InputRequestEventInstance
      return e
    }
    else if (e instanceof GameOverEvent) {
      // Some games, such as Innovation, can alter the outcome of a game over event based on
      // board conditions. (eg. Jackie Chan in Innovation)
      const result = this._gameOver(e as GameOverEventInstance)

      this.gameOver = true
      this.gameOverData = result.data
      if (result.data.player && typeof result.data.player === 'object' && 'name' in result.data.player) {
        this.gameOverData!.player = (this.gameOverData!.player as { name: string }).name
      }

      this.log.add({ template: this.getResultMessage() })

      return result
    }
    else {
      throw e
    }
  }
}

Game.prototype.undo = function(this: Game): '__NO_MORE_ACTIONS__' | '__NO_UNDO__' | '__SUCCESS__' {
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

    const next = responsesCopy.pop()!

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

Game.prototype.youWin = function(this: Game, player: { name: string }, reason: string): never {
  throw new (GameOverEvent as unknown as new (data: GameOverData) => { data: GameOverData })({
    player,
    reason,
  })
}


////////////////////////////////////////////////////////////////////////////////
// Chat and Logging

Game.prototype.getResultMessage = function(this: Game): string {
  if (this.checkGameIsOver()) {
    const player = this.gameOverData!.player
    const winnerName = typeof player === 'object' && 'name' in player ? player.name : player
    const reason = this.gameOverData!.reason
    return `${winnerName} wins due to ${reason}`
  }
  else {
    return 'in progress'
  }
}

Game.prototype.getViewerName = function(this: Game): string | undefined {
  return this.viewerName
}


////////////////////////////////////////////////////////////////////////////////
// Protected Methods

Game.prototype._gameOver = function(this: Game, event: { data: GameOverData }): { data: GameOverData } {
  this.log.setIndent(0)
  return event
}

Game.prototype._mainProgram = function(this: Game): void {
  throw new Error('Please implement _mainProgram')
}

Game.prototype._blankState = function(this: Game, more: Record<string, unknown> = {}): GameState {
  return Object.assign({
    indent: 0,
    responseIndex: -1,
  }, more)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Game.prototype._responseReceived = function(this: Game, response: Response): void {
  // To be overridden by child classes.
}

Game.prototype._undoCalled = function(this: Game): void {
  // To be overridden by child classes.
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Game.prototype._cardMovedCallback = function(this: Game, card: unknown): void {
  // To be overridden by child classes.
}

////////////////////////////////////////////////////////////////////////////////
// Private Methods

Game.prototype._breakpoint = function(this: Game, name: string): void {
  const callbacks = this.breakpoints[name] || []
  for (const callback of callbacks) {
    callback(this)
  }
}

Game.prototype._getResponse = function(this: Game): Response | undefined {
  this.state.responseIndex += 1
  return this.responses[this.state.responseIndex]
}

// When overriding, always call super before doing any additional state updates.
Game.prototype._reset = function(this: Game): void {
  this.random = seedrandom(this.settings.seed)
  this.state = this._blankState()
  this.log.reset()
  this.players.reset()
  this.cards.reset()
  this.zones.reset()
}

Game.prototype._tryToAutomaticallyRespond = function(this: Game, selectors: SelectorInput[]): Response | undefined {
  for (const sel of selectors) {
    // This is a special key to say that there is no fixed response expected
    // so cannot automatically respond. Used in games like Magic where the
    // user input is very freeform.
    if (sel.choices === '__UNSPECIFIED__') {
      return undefined
    }

    // Don't try to understand nested structures.
    for (const choice of sel.choices as unknown[]) {
      if (typeof choice === 'object' && choice !== null && 'choices' in choice) {
        return undefined
      }
    }

    const { min } = selector.minMax(sel)

    if (min >= (sel.choices as unknown[]).length) {
      const response: Response = {
        actor: sel.actor,
        title: sel.title,
        selection: [...(sel.choices as unknown[])],
      }

      // Rename choices to selection down to one lower level.
      for (const x of response.selection!) {
        if (typeof x === 'object' && x !== null && 'choices' in x) {
          (x as Record<string, unknown>).selection = (x as Record<string, unknown>).choices
          delete (x as Record<string, unknown>).choices
        }
      }

      return response
    }
  }

  return undefined
}


////////////////////////////////////////////////////////////////////////////////
// Test only methods

Game.prototype.testSetBreakpoint = function(this: Game, name: string, fn: (game: Game) => void): void {
  if (Object.hasOwn(this.breakpoints, name)) {
    this.breakpoints[name].push(fn)
  }
  else {
    this.breakpoints[name] = [fn]
  }
}


////////////////////////////////////////////////////////////////////////////////
// Standard game methods

Game.prototype.checkSameTeam = function(this: Game, p1: { team: string }, p2: { team: string }): boolean {
  return p1.team === p2.team
}


////////////////////////////////////////////////////////////////////////////////
// Specialty functions

Game.prototype.historicalView = function(this: Game, index: number): Game {
  const data: SerializedGame = {
    _id: this._id,
    settings: this.settings,
    responses: this.responses.slice(0, index + 1),
  }

  return new this.constructor(data, this.viewerName)
}

module.exports = {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
}

export {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
  GameSettings,
  SerializedGame,
  Response,
  SelectorInput,
  GameOverData,
  GameOptions,
  GameState,
}
