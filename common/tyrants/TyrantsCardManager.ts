import { BaseCardManager } from '../lib/game/index.js'

import type { TyrantsBaseCard } from './TyrantsBaseCard.js'
import type { TyrantsZone } from './TyrantsZone.js'

// Use actual types
type Card = TyrantsBaseCard
type Zone = TyrantsZone

class TyrantsCardManager extends BaseCardManager<any, Card> {
  constructor(game: any) {
    super(game)
  }
}

export { TyrantsCardManager }
