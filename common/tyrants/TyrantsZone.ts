const { BaseZone, ZONE_KIND } = require('../lib/game/index.js')

import type { BaseZone as BaseZoneType } from '../lib/game/index.js'
import type { Player } from './TyrantsBaseCard.js'

interface Card {
  reveal(): void
  show(player: Player): void
  hide(): void
}

interface TyrantsZone {
  _updateCardVisibility(card: Card): void
}

class TyrantsZone extends BaseZone {
  _updateCardVisibility(card: Card): void {
    const kind = this.kind()
    if (kind === ZONE_KIND.public || kind === 'location') {
      card.reveal()
    }
    else if (kind === ZONE_KIND.private) {
      card.show(this.owner() as any)
    }
    else if (kind === ZONE_KIND.hidden) {
      card.hide()
    }
    else {
      throw new Error('Unknown zone kind: ' + kind)
    }
  }
}

module.exports = {
  TyrantsZone,
}

export { TyrantsZone }
