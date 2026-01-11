import type { Game } from './GameProxy.js'
import type { BasePlayer } from './BasePlayer.js'

interface LogArgValue {
  value: unknown
  classes?: string[]
}

type LogArgHandler = (value: unknown) => LogArgValue

interface LogMessage {
  template: string
  args?: Record<string, unknown>
  classes?: string[]
}

class Chat {
  id: number
  author: string
  position: number
  text: string
  type: 'chat'

  constructor(playerName: string, text: string, position: number) {
    this.id = Date.now()
    this.author = playerName
    this.position = position
    this.text = text
    this.type = 'chat'
  }
}

class LogEntry {
  id: number
  indent: number
  template: string
  args: Record<string, LogArgValue>
  classes: string[]
  type: 'log'

  constructor(id: number, indent: number, template: string, args: Record<string, unknown>, classes: string[]) {
    this.id = id
    this.indent = indent
    this.template = template
    this.args = args as Record<string, LogArgValue>
    this.classes = classes
    this.type = 'log'
  }
}

interface ResponseData {
  actor: string
  [key: string]: unknown
}

class Response {
  data: ResponseData
  type: 'response-received'

  constructor(data: ResponseData) {
    this.data = data
    this.type = 'response-received'
  }
}

type MergedEntry = Chat | LogEntry | Response

class BaseLogManager {
  protected _game: Game
  protected _chat: Chat[]
  protected _log: (LogEntry | Response)[]
  protected _indent: number
  protected _viewerName: string | undefined
  protected _logArgHandlers: Map<string, LogArgHandler>

  constructor(game: Game, chat?: Chat[], viewerName?: string) {
    this._game = game
    this._chat = chat || []
    this._log = []
    this._indent = 0
    this._viewerName = viewerName
    this._logArgHandlers = new Map()
    this._registerDefaultHandlers()
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Actions

  add(msg: LogMessage): void {
    if (!msg.template) {
      console.log(msg)
      throw new Error('Log entry missing template')
    }

    const entry = new LogEntry(
      this._log.length,
      this._indent,
      msg.template,
      msg.args || {},
      msg.classes || [],
    )
    this._enrichLogArgs(entry)
    if (this._postEnrichArgs(entry)) {
      return
    }
    this._log.push(entry)
  }

  addDoNothing(player: BasePlayer): void {
    this.add({
      template: '{player} does nothing',
      args: { player },
    })
  }

  addNoEffect(): void {
    this.add({ template: 'no effect' })
  }

  chat(playerName: string, text: string): void {
    const chat = new Chat(playerName, text, this._log.length)
    this._chat.push(chat)
  }

  deleteChat(id: number): void {
    const index = this._chat.findIndex(c => c.id === id)
    this._chat.splice(index, 1)
  }

  indent(count: number = 1): void {
    this._indent += count
  }

  outdent(count: number = 1): void {
    this._indent -= count
  }

  reindexChat(): void {
    const maxIndex = this._log.length
    for (const chat of this._chat) {
      if (chat.position > maxIndex) {
        chat.position = maxIndex
      }
    }
  }

  reset(): void {
    this._log = []
  }

  // This allows the log to calculate and find new messages for a given player.
  responseReceived(data: ResponseData): void {
    const resp = new Response(data)
    this._log.push(resp)
  }

  setIndent(value: number): void {
    this._indent = value <= 0 ? 0 : value
  }

  setChat(chat: Chat[]): void {
    this._chat = chat
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Getters

  getChat(): Chat[] {
    return [...this._chat]
  }

  getLog(): (LogEntry | Response)[] {
    return [...this._log]
  }

  getIndent(): number {
    return this._indent
  }

  merged(): MergedEntry[] {
    if (this._chat.length === 0) {
      return this.getLog()
    }

    const output: MergedEntry[] = []

    let chatIndex = 0
    let logIndex = 0

    for (; logIndex < this._log.length; logIndex++) {
      output.push(this._log[logIndex])

      while (this._chat[chatIndex] && this._chat[chatIndex].position === logIndex) {
        output.push(this._chat[chatIndex])
        chatIndex += 1
      }
    }

    while (chatIndex < this._chat.length) {
      output.push(this._chat[chatIndex])
      chatIndex += 1
    }

    return output
  }

  newChatsCount(playerOrName: BasePlayer | string): number {
    const playerName = typeof playerOrName === 'object' && playerOrName.name ? playerOrName.name : playerOrName as string

    // See if any chats exist before the last response of this player.
    // If yes, assume they are new.
    const rlog = [...this.merged()].reverse()

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


  ////////////////////////////////////////////////////////////////////////////////
  // Handler system

  registerHandler(key: string, handler: LogArgHandler): void {
    this._logArgHandlers.set(key, handler)
  }

  unregisterHandler(key: string): void {
    this._logArgHandlers.delete(key)
  }

  _registerDefaultHandlers(): void {
    // Handler for 'players' key
    this.registerHandler('players', (players) => ({
      value: (players as BasePlayer[]).map(p => p.name || p).join(', '),
      classes: ['player-names'],
    }))

    // Handler for keys starting with 'player'
    this.registerHandler('player*', (player) => ({
      value: (player as BasePlayer).name || player,
      classes: ['player-name']
    }))

    // Handler for keys starting with 'card'
    this.registerHandler('card*', (card) => ({
      value: (card as { id: string }).id,
      classes: ['card-id'],
    }))

    // Handler for keys starting with 'zone'
    this.registerHandler('zone*', (zone) => ({
      value: (zone as { name(): string }).name(),
      classes: ['zone-name']
    }))
  }

  ////////////////////////////////////////////////////////////////////////////////
  // protected members


  _enrichLogArgs(entry: LogEntry): void {
    for (const key of Object.keys(entry.args)) {
      let handler: LogArgHandler | null = null

      // Check for exact key match first
      if (this._logArgHandlers.has(key)) {
        handler = this._logArgHandlers.get(key)!
      }
      // Check for wildcard patterns (keys ending with '*')
      else {
        for (const [handlerKey, handlerFunc] of this._logArgHandlers) {
          if (handlerKey.endsWith('*') && key.startsWith(handlerKey.slice(0, -1))) {
            handler = handlerFunc
            break
          }
        }
      }

      if (handler) {
        entry.args[key] = handler(entry.args[key])
      }
      // Convert string args to a dict if no handler found and it's not already an object
      else if (typeof entry.args[key] !== 'object') {
        entry.args[key] = {
          value: entry.args[key],
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _postEnrichArgs(entry: LogEntry): boolean {
    return false
  }
}


module.exports = {
  BaseLogManager,
}

export { BaseLogManager, LogEntry, Chat, Response, LogMessage, LogArgHandler, LogArgValue }
