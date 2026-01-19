import { BaseZone, ZONE_KIND } from '../lib/game/index.js'
import type { Game as BaseGame } from '../lib/game/GameProxy.js'

interface MagicZoneCard {
  morph: boolean
  secret: boolean
  show(owner: unknown): void
  reveal(): void
  hide(): void
}

class MagicZone extends BaseZone<BaseGame, MagicZoneCard> {
  override _updateCardVisibility(card: MagicZoneCard): void {
    if (this._kind === ZONE_KIND.public) {
      if (card.morph || card.secret) {
        card.show(this.owner())
      }
      else {
        card.reveal()
      }
    }
    else if (this._kind === ZONE_KIND.private) {
      card.show(this.owner())
    }
    else if (this._kind === ZONE_KIND.hidden) {
      card.hide()
    }
    else {
      throw new Error('Unknown zone kind: ' + this._kind)
    }
  }
}

export { MagicZone }
