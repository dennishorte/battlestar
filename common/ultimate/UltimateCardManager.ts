const { BaseCardManager } = require('../lib/game/index.js')

import type { UltimatePlayer } from './UltimatePlayer.js'

interface Card {
  id: string
}

interface Achievement {
  id: string
}

interface ExpansionData {
  cards: Card[]
  achievements: Achievement[]
}

interface Zone {
  cardlist(): Card[]
  peek(): Card | null
}

interface UltimateUtils {
  colors(): string[]
}

interface ZoneManager {
  byId(id: string): Zone
  colorStacks(player: UltimatePlayer): Zone[]
}

interface PlayerManager {
  all(): UltimatePlayer[]
}

interface Game {
  zones: ZoneManager
}

class UltimateCardManager extends BaseCardManager {
  _expansions!: Record<string, ExpansionData>
  game!: Game
  zones!: ZoneManager
  players!: PlayerManager
  util!: UltimateUtils

  constructor(...args: unknown[]) {
    super(...args)
  }

  registerExpansion(exp: string, data: ExpansionData): void {
    this._expansions[exp] = data

    for (const card of data.cards) {
      this.register(card)
    }

    for (const ach of data.achievements) {
      this.register(ach)
    }
  }

  byDeck(exp: string, age: number): Card[] {
    const id = `decks.${exp}.${age}`
    return this.game.zones.byId(id).cardlist()
  }

  byExp(exp: string): ExpansionData {
    return this._expansions[exp]
  }

  bottom(player: UltimatePlayer, color: string): Card | undefined {
    return this.byPlayer(player, color).slice(-1)[0]
  }

  bottoms(player: UltimatePlayer): Card[] {
    return this.util.colors().map((color: string) => this.bottom(player, color)).filter((x: Card | undefined): x is Card => Boolean(x))
  }

  fullBoard(player: UltimatePlayer): Card[] {
    return this.util.colors().flatMap((color: string) => this.byPlayer(player, color))
  }

  top(player: UltimatePlayer, color: string): Card | undefined {
    return this.byPlayer(player, color)[0]
  }

  tops(player: UltimatePlayer): Card[] {
    return this.zones.colorStacks(player).map((zone: Zone) => zone.peek()).filter((x: Card | null): x is Card => Boolean(x))
  }

  topsAll(): Card[] {
    return this.players.all().flatMap((player: UltimatePlayer) => this.tops(player))
  }

  reset(): void {
    super.reset()
    this._expansions = {}
  }
}

module.exports = {
  UltimateCardManager,
}

export { UltimateCardManager }
