import { BaseCardManager } from '../lib/game/index.js'
import type { Game as BaseGame } from '../lib/game/GameProxy.js'

import type { TyrantsPlayer } from './TyrantsPlayer.js'

interface Card {
  id: string
}

interface Zone {
  cardlist(): Card[]
}

interface ZoneManager {
  byId(id: string): Zone
}

interface Game extends BaseGame {
  zones: ZoneManager
}

class TyrantsCardManager extends BaseCardManager<Game> {
  constructor(game: Game) {
    super(game)
  }
}

export { TyrantsCardManager }
