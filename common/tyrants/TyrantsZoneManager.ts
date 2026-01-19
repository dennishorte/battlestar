import { BaseZoneManager } from '../lib/game/index.js'
import type { Game as BaseGame } from '../lib/game/GameProxy.js'
import { TyrantsZone } from './TyrantsZone.js'
import type { TyrantsPlayer } from './TyrantsPlayer.js'

interface Zone {
  id: string
  cardlist(): unknown[]
}

interface Game extends BaseGame {
  // Game reference
}

class TyrantsZoneManager extends BaseZoneManager<Game> {
  constructor(game: Game) {
    super(game)
    this._zoneConstructor = TyrantsZone
  }
}

export { TyrantsZoneManager }
