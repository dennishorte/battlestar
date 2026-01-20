import { BasePlayerManager, PlayerData } from '../lib/game/index.js'
import { UltimatePlayer } from './UltimatePlayer.js'

interface PlayerManagerOptions {
  playerClass?: typeof UltimatePlayer
}

class UltimatePlayerManager extends BasePlayerManager<any, UltimatePlayer> {
  constructor(game: any, users: PlayerData[], opts: PlayerManagerOptions = {}) {
    opts = Object.assign(opts, {
      playerClass: UltimatePlayer,
    })
    super(game, users, opts)
  }
}

export { UltimatePlayerManager }
