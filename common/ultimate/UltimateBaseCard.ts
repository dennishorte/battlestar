import { BaseCard } from '../lib/game/index.js'

interface CardData {
  name: string
  expansion?: string
  age?: number
  biscuits?: string
  isMuseum?: boolean
  isSpecialAchievement?: boolean
  isDecree?: boolean
}

interface Player {
  id: string
  name: string
}

interface Game {
  players: {
    byOwner(card: UltimateBaseCard): Player | null
  }
}

interface Zone {
  owner(): Player | null
}

class UltimateBaseCard extends BaseCard {
  id!: string
  name!: string
  expansion?: string
  age?: number
  biscuits?: string
  isMuseum?: boolean
  isSpecialAchievement?: boolean
  isDecree?: boolean
  owner?: Player | null
  game!: Game

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

  _afterMoveTo(newZone: Zone): void {
    // In Innovation, card ownership is determined entirely by where the card is located.
    this.owner = newZone.owner()
  }

  _beforeMoveTo(newZone: Zone, newIndex: number, prevZone: Zone, prevIndex: number): { preventDefault: boolean } | undefined {
    if (prevZone === newZone && prevIndex === newIndex) {
      return {
        preventDefault: true,
      }
    }
  }
}

export { UltimateBaseCard }
export type { CardData, Player, Game, Zone }
