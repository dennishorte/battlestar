import { BasePlayer } from '../lib/game/index.js'
import type { Game as BaseGame } from '../lib/game/GameProxy.js'

interface PlayerData {
  name: string
  id?: string
}

interface Game extends BaseGame {
  // Game reference - will be set by BasePlayer
}

class TyrantsPlayer extends BasePlayer<Game> {
  constructor(game: Game, data: PlayerData) {
    super(game, data)
  }
}

export { TyrantsPlayer }
