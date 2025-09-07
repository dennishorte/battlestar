
class Chat {
  constructor(playerName, text, position) {
    this.id = Date.now()
    this.author = playerName
    this.position = position
    this.text = text
    this.type = 'chat'
  }
}

class LogEntry {
  constructor(id, indent, template, args, classes) {
    this.id = id
    this.indent = indent
    this.template = template
    this.args = args
    this.classes = classes
    this.type = 'log'
  }
}

class Response {
  constructor(data) {
    this.data = data
    this.type = 'response-received'
  }
}

class BaseLogManager {
  constructor(game, chat, viewerName) {
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

  add(msg) {
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

  addDoNothing(player) {
    this.add({
      template: '{player} does nothing',
      args: { player },
    })
  }

  addNoEffect() {
    this.add({ template: 'no effect' })
  }

  chat(playerName, text) {
    const chat = new Chat(playerName, text, this._log.length)
    this._chat.push(chat)
  }

  deleteChat(id) {
    const index = this._chat.findIndex(c => c.id === id)
    this._chat.splice(index, 1)
  }

  indent(count=1) {
    this._indent += count
  }

  outdent(count=1) {
    this._indent -= count
  }

  reindexChat() {
    const maxIndex = this._log.length
    for (const chat of this._chat) {
      if (chat.position > maxIndex) {
        chat.position = maxIndex
      }
    }
  }

  reset() {
    this._log = []
  }

  // This allows the log to calculate and find new messages for a given player.
  responseReceived(data) {
    const resp = new Response(data)
    this._log.push(resp)
  }

  setIndent(value) {
    this._indent = value <= 0 ? 0 : value
  }

  setChat(chat) {
    this._chat = chat
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Getters

  getChat() {
    return [...this._chat]
  }

  getLog() {
    return [...this._log]
  }

  getIndent() {
    return this._indent
  }

  merged() {
    if (this._chat.length === 0) {
      return this.getLog()
    }

    const output = []

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

  newChatsCount(playerOrName) {
    const playerName = playerOrName.name ? playerOrName.name : playerOrName

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

  registerHandler(key, handler) {
    this._logArgHandlers.set(key, handler)
  }

  unregisterHandler(key) {
    this._logArgHandlers.delete(key)
  }

  _registerDefaultHandlers() {
    // Handler for 'players' key
    this.registerHandler('players', (players) => ({
      value: players.map(p => p.name || p).join(', '),
      classes: ['player-names'],
    }))

    // Handler for keys starting with 'player'
    this.registerHandler('player*', (player) => ({
      value: player.name || player,
      classes: ['player-name']
    }))

    // Handler for keys starting with 'card'
    this.registerHandler('card*', (card) => ({
      value: card.id,
      classes: ['card-id'],
    }))

    // Handler for keys starting with 'zone'
    this.registerHandler('zone*', (zone) => ({
      value: zone.name(),
      classes: ['zone-name']
    }))
  }

  ////////////////////////////////////////////////////////////////////////////////
  // protected members


  _enrichLogArgs(entry) {
    for (const key of Object.keys(entry.args)) {
      let handler = null
      
      // Check for exact key match first
      if (this._logArgHandlers.has(key)) {
        handler = this._logArgHandlers.get(key)
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

  // eslint-disable-next-line
  _postEnrichArgs(entry) {
    return false
  }
}


module.exports = {
  BaseLogManager,
}

