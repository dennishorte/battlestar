import { BaseCardManager, ICard } from '../lib/game/index.js'

import type { MagicCard } from './MagicCard.js'

// MagicCard extends ICard, so we use it as the TCard parameter
class MagicCardManager extends BaseCardManager<any, MagicCard> {
  constructor(game: any) {
    super(game)
  }
}

export { MagicCardManager }
