import { BasePlayer } from '../lib/game/index.js'

interface PlayerData {
  name: string
  id?: string
}

interface Game {
  // Game reference - will be set by BasePlayer
}

class TyrantsPlayer extends BasePlayer {
  game!: Game
  id!: string
  name!: string

  constructor(game: Game, data: PlayerData) {
    super(game, data)
  }
}

export { TyrantsPlayer }
