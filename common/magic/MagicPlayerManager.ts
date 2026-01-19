import { BasePlayerManager } from '../lib/game/index.js'

import type { BasePlayerManager as BasePlayerManagerType } from '../lib/game/index.js'

interface MagicCard {
  zone: unknown
}

interface Player {
  [key: string]: unknown
}

class MagicPlayerManager extends BasePlayerManager {
  byController(card: MagicCard): Player {
    return this.byZone(card.zone)
  }
}

export { MagicPlayerManager }
