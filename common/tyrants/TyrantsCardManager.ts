import { BaseCardManager, ICard, IZone } from '../lib/game/index.js'
import type { Game as BaseGame } from '../lib/game/GameProxy.js'

import type { TyrantsPlayer } from './TyrantsPlayer.js'

interface Card extends ICard {
  id: string
}

interface Zone extends IZone {
  cardlist(): Card[]
}

interface ZoneManager {
  byId(id: string): Zone
}

interface Game extends BaseGame {
  zones: ZoneManager
}

class TyrantsCardManager extends BaseCardManager<any, Card> {
  constructor(game: any) {
    super(game)
  }
}

export { TyrantsCardManager }
