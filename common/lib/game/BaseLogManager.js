
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
  constructor(game, chat) {
    this._game = game
    this._chat = chat || []
    this._log = []
    this._indent = 0
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Actions

  add(msg) {
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

  responseReceived(data) {
    const resp = new Response(data)
    this._log.push(resp)
  }

  setIndent(value) {
    this._indent = value <= 0 ? 0 : value
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
  // protected members

  _enrichLogArgs(entry) {
    for (const key of Object.keys(entry.args)) {
      if (key === 'players') {
        const players = entry.args[key]
        entry.args[key] = {
          value: players.map(p => p.name || p).join(', '),
          classes: ['player-names'],
        }
      }
      else if (key.startsWith('player')) {
        const player = entry.args[key]
        entry.args[key] = {
          value: player.name || player,
          classes: ['player-name']
        }
      }
      else if (key.startsWith('card')) {
        const card = entry.args[key]
        entry.args[key] = {
          value: card.id,
          classes: ['card-id'],
        }
      }
      else if (key.startsWith('zone')) {
        const zone = entry.args[key]
        entry.args[key] = {
          value: zone.name,
          classes: ['zone-name']
        }
      }
      // Convert string args to a dict
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
