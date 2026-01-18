import type { Game } from './GameProxy.js'
import { GameProxy } from './GameProxy.js'

// Forward declarations for circular dependencies
interface BasePlayer {
  name: string
}

interface BaseCard {
  id: string | null
}

interface BaseZone {
  cardlist(): BaseCard[]
}

interface BaseZoneManager {
  byPlayer(player: BasePlayer, zoneName: string): BaseZone
  byId(zoneId: string): BaseZone
}

class BaseCardManager {
  game: Game
  protected _cards: Record<string, BaseCard>

  // Proxied property from game
  declare zones: BaseZoneManager

  constructor(game: Game) {
    this.game = game
    this._cards = {}
    this.reset()

    return GameProxy.create(this)
  }

  register(card: BaseCard): void {
    if (card.id! in this._cards) {
      throw new Error('Duplicate card ids: ' + card.id)
    }
    this._cards[this._getCardId(card)] = card
  }

  all(): BaseCard[] {
    return Object.values(this._cards)
  }

  byId(id: string): BaseCard {
    if (!Object.hasOwn(this._cards, id)) {
      throw new Error('Unknown card: ' + id)
    }
    return this._cards[id]
  }

  byPlayer(player: BasePlayer, zoneName: string): BaseCard[] {
    return this.zones.byPlayer(player, zoneName).cardlist()
  }

  byZone(zoneId: string): BaseCard[] {
    return this.zones.byId(zoneId).cardlist()
  }

  hasId(id: string): boolean {
    return (id in this._cards)
  }

  reset(): void {
    this._cards = {}
  }

  protected _getCardId(card: BaseCard): string {
    return card.id!
  }
}

export { BaseCardManager }
