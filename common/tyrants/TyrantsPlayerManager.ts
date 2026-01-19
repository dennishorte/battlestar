import { BasePlayerManager } from '../lib/game/index.js'
import { TyrantsPlayer } from './TyrantsPlayer.js'

interface User {
  name: string
  id?: string
}

interface Game {
  // Game reference
}

interface PlayerManagerOptions {
  playerClass?: typeof TyrantsPlayer
}

class TyrantsPlayerManager extends BasePlayerManager {
  constructor(game: Game, users: User[], opts: PlayerManagerOptions = {}) {
    opts = Object.assign(opts, {
      playerClass: TyrantsPlayer,
    })
    super(game, users, opts)
  }
}

export { TyrantsPlayerManager }
