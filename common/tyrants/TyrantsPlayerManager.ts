import { BasePlayerManager, PlayerData } from '../lib/game/index.js'
import { TyrantsPlayer } from './TyrantsPlayer.js'

interface PlayerManagerOptions {
  playerClass?: typeof TyrantsPlayer
}

class TyrantsPlayerManager extends BasePlayerManager<any, TyrantsPlayer> {
  constructor(game: any, users: PlayerData[], opts: PlayerManagerOptions = {}) {
    opts = Object.assign(opts, {
      playerClass: TyrantsPlayer,
    })
    super(game, users, opts)
  }
}

export { TyrantsPlayerManager }
