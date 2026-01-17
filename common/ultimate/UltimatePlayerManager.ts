const { BasePlayerManager } = require('../lib/game/index.js')
const { UltimatePlayer } = require('./UltimatePlayer.js')

interface User {
  name: string
  id?: string
}

interface Game {
  // Game reference
}

interface PlayerManagerOptions {
  playerClass?: typeof UltimatePlayer
}

class UltimatePlayerManager extends BasePlayerManager {
  constructor(game: Game, users: User[], opts: PlayerManagerOptions = {}) {
    opts = Object.assign(opts, {
      playerClass: UltimatePlayer,
    })
    super(game, users, opts)
  }
}

module.exports = {
  UltimatePlayerManager,
}

export { UltimatePlayerManager }
