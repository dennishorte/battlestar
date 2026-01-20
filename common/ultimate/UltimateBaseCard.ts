import { BaseCard, BeforeMoveResult } from '../lib/game/index.js'
import type { Game as BaseGame } from '../lib/game/GameProxy.js'
import type { KarmaImpl } from './types.js'

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

interface UltimateUtils {
  parseBiscuits(biscuitString: string): Record<string, number>
  getAsArray<T>(obj: unknown, key: string): T[]
}

interface Game extends BaseGame {
  players: {
    byOwner(card: UltimateBaseCard): Player | null
  }
  zones: {
    byPlayer(player: Player, zone: string): Zone
  }
  cards: {
    top(player: Player, color: string): { id: string } | null
  }
  util: UltimateUtils
}

interface Zone {
  id: string
  splay?: string
  cardlist(): unknown[]
  nextIndex(): number
  push(card: unknown, index: number): void
  owner(): Player | null
  isColorZone(): boolean
  isArtifactZone?(): boolean
  isMuseumZone?(): boolean
}

// Types for card effects - defined here to avoid circular dependencies
interface VisibleEffectsResult {
  card: UltimateBaseCard
  texts: string[]
  impls: Array<(game: unknown, player: Player) => void>
}

interface KarmaInfo {
  card: UltimateBaseCard
  index: number
  text: string
  impl: KarmaImpl
}

class UltimateBaseCard extends BaseCard<Game, Zone, Player> {
  declare name: string
  expansion?: string
  age?: number
  biscuits?: string
  isMuseum?: boolean
  isSpecialAchievement?: boolean
  isDecree?: boolean

  // Properties with defaults - overridden in UltimateAgeCard
  color: string = ''
  dogmaBiscuit: string = ''
  dogma: string[] = []
  echo: string[] = []
  karma: string[] = []
  visibleAge: number | null = null

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

  // Methods with default implementations - overridden in UltimateAgeCard
  checkIsCity(): boolean {
    return false
  }

  checkIsFigure(): boolean {
    return false
  }

  checkIsArtifact(): boolean {
    return false
  }

  checkIsEchoes(): boolean {
    return false
  }

  checkBiscuitIsVisible(_biscuit: string): boolean {
    return false
  }

  checkSharesBiscuit(_card: UltimateBaseCard): boolean {
    return false
  }

  checkHasDemand(): boolean {
    return false
  }

  checkHasBonus(): boolean {
    return false
  }

  visibleBiscuits(): string {
    return ''
  }

  visibleBiscuitsParsed(): Record<string, number> {
    return {}
  }

  visibleEffects(_kind: string, _opts?: { selfExecutor?: boolean }): VisibleEffectsResult | undefined {
    return undefined
  }

  getBonuses(): number[] {
    return []
  }

  getBiscuitCount(_biscuit: string): number {
    return 0
  }

  getKarmaInfo(_trigger: string): KarmaInfo[] {
    return []
  }

  isTopCard(): boolean {
    return false
  }

  isTopCardStrict(): boolean {
    return false
  }

  inHand(_player?: Player): boolean {
    return false
  }

  isDistinct(cards: UltimateBaseCard[]): boolean {
    return !cards.includes(this)
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
export type { CardData, Player, Game, Zone, KarmaInfo, VisibleEffectsResult }
