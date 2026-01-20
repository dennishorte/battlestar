import { BaseZoneManager } from '../lib/game/index.js'
import type { Game as BaseGame } from '../lib/game/GameProxy.js'
import { TyrantsZone } from './TyrantsZone.js'

// Use actual TyrantsZone type
type Zone = TyrantsZone

class TyrantsZoneManager extends BaseZoneManager<any, Zone> {
  constructor(game: BaseGame) {
    super(game)
    this._zoneConstructor = TyrantsZone
  }
}

export { TyrantsZoneManager }
