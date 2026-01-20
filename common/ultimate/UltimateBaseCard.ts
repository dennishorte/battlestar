import { BaseCard, BeforeMoveResult } from '../lib/game/index.js'
import type { Game as BaseGame } from '../lib/game/GameProxy.js'

interface CardData {
  id?: string | null
  name: string
  expansion?: string
  age?: number
  biscuits?: string
  isMuseum?: boolean
  isSpecialAchievement?: boolean
  isDecree?: boolean
  [key: string]: unknown
}

interface Player {
  id: string
  name: string
}

interface Game extends BaseGame {
  players: {
    byOwner(card: UltimateBaseCard): Player | null
  }
}

interface Zone {
  id: string
  cardlist(): unknown[]
  nextIndex(): number
  push(card: unknown, index: number): void
  owner(): Player | null
}

class UltimateBaseCard extends BaseCard<Game, Zone, Player> {
  declare name: string
  expansion?: string
  age?: number
  biscuits?: string
  isMuseum?: boolean
  isSpecialAchievement?: boolean
  isDecree?: boolean

  constructor(game: Game, data: CardData) {
    super(game, data)

    // Card names are unique in Innovation, so we'll use them for the card IDs.
    this.id = data.name
  }

  checkHasBiscuit(biscuit: string): boolean {
    return Boolean(this.biscuits?.includes(biscuit))
  }

  checkIsExpansion(): boolean {
    return this.expansion !== 'base'
  }

  checkIsMuseum(): boolean {
    return Boolean(this.isMuseum)
  }

  checkIsStandardAchievement(): boolean {
    return !this.isSpecialAchievement && !this.isDecree && !this.isMuseum
  }

  checkIsAgeCard(): boolean {
    return false // overridden in age cards
  }

  getAge(): number | undefined {
    return this.age
  }

  getHiddenName(game: Game | null = null): string {
    if (this.isSpecialAchievement || this.isDecree) {
      return this.name
    }

    const owner = game?.players.byOwner(this)
    if (owner) {
      return `*${this.expansion}-${this.age}* (${owner.name})`
    }
    else {
      return `*${this.expansion}-${this.age}*`
    }
  }

  override _afterMoveTo(newZone: Zone, _newIndex: number | null, _oldZone: Zone, _oldIndex: number, _beforeCache?: BeforeMoveResult): void {
    // In Innovation, card ownership is determined entirely by where the card is located.
    this.owner = newZone.owner()
  }

  override _beforeMoveTo(newZone: Zone, newIndex: number | null, prevZone: Zone, prevIndex: number): BeforeMoveResult | void {
    if (prevZone === newZone && prevIndex === newIndex) {
      return {
        preventDefault: true,
      }
    }
  }
}

export { UltimateBaseCard }
export type { CardData, Player, Game, Zone }
