import { BasePlayerManager, BasePlayerInterface } from '../lib/game/index.js'

import type { MagicCard } from './MagicCard.js'

// MagicPlayer interface - there's no MagicPlayer class, players use BasePlayer with these extra properties
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
