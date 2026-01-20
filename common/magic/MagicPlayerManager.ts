import { BasePlayerManager, BasePlayerInterface, IZone } from '../lib/game/index.js'

interface MagicCard {
  zone: IZone | null
}

interface MagicPlayer extends BasePlayerInterface {
  counters: Record<string, number>
  addCounter(name: string, value: number): void
  incrementCounter(name: string, amount: number): void
  [key: string]: unknown
}

class MagicPlayerManager extends BasePlayerManager<any, MagicPlayer> {
  byController(card: MagicCard): MagicPlayer | null {
    if (!card.zone) return null
    return this.byZone(card.zone as unknown as { owner(): MagicPlayer | null })
  }
}

export { MagicPlayerManager }
