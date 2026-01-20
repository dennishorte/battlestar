import { BasePlayerManager } from '../../lib/game/index.js'
import { CubeDraftPlayer } from './CubeDraftPlayer.js'
import type { Game } from '../../lib/game/GameProxy.js'

class CubeDraftPlayerManager extends BasePlayerManager<Game, CubeDraftPlayer> {
  constructor(game: Game, users: { _id: string; name: string; [key: string]: unknown }[], opts = {}) {
    super(game, users, {
      ...opts,
      playerClass: CubeDraftPlayer,
    })
  }
}

export { CubeDraftPlayerManager }
