const { BasePlayerManager } = require('../../lib/game/index.js')
const { CubeDraftPlayer } = require('./CubeDraftPlayer.js')

import type { BasePlayerManager as BasePlayerManagerType } from '../../lib/game/index.js'

interface DraftGame {
  [key: string]: unknown
}

interface User {
  [key: string]: unknown
}

interface ManagerOptions {
  playerClass?: typeof CubeDraftPlayer
  [key: string]: unknown
}

class CubeDraftPlayerManager extends BasePlayerManager {
  constructor(game: DraftGame, users: User[], opts: ManagerOptions = {}) {
    opts.playerClass = CubeDraftPlayer
    super(game, users, opts)
  }
}


module.exports = { CubeDraftPlayerManager }

export { CubeDraftPlayerManager }
