import type { Game } from './GameProxy.js'
import type { ICard, IPlayer, IZoneManager } from './interfaces.js'
import { GameProxy } from './GameProxy.js'

class BaseCardManager<
  TGame extends Game = Game,
  TCard extends ICard = ICard
> {
  game: TGame
  protected _cards: Record<string, TCard>

  // Proxied property from game
  declare zones: IZoneManager

  constructor(game: TGame) {
    this.game = game
    this._cards = {}
    this.reset()

    return GameProxy.create(this)
  }

  register(card: TCard): void {
    if (card.id! in this._cards) {
      throw new Error('Duplicate card ids: ' + card.id)
    }
    this._cards[this._getCardId(card)] = card
  }

  all(): TCard[] {
    return Object.values(this._cards)
  }

  byId(id: string): TCard {
    if (!Object.hasOwn(this._cards, id)) {
      throw new Error('Unknown card: ' + id)
    }
    return this._cards[id]
  }

  byPlayer(player: IPlayer, zoneName: string): TCard[] {
    return this.zones.byPlayer(player, zoneName).cardlist() as TCard[]
  }

  byZone(zoneId: string): TCard[] {
    return this.zones.byId(zoneId).cardlist() as TCard[]
  }

  hasId(id: string): boolean {
    return (id in this._cards)
  }

  reset(): void {
    this._cards = {}
  }

  protected _getCardId(card: TCard): string {
    return card.id!
  }
}

export { BaseCardManager }
