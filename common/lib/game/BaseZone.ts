import type { Game } from './GameProxy.js'
import { GameProxy } from './GameProxy.js'
import util from '../util.js'

const ZONE_KIND = {
  public: 'public',
  private: 'private',
  hidden: 'hidden'
} as const

type ZoneKind = typeof ZONE_KIND[keyof typeof ZONE_KIND]

// Forward declarations for circular dependencies
interface BaseCard {
  id: string | null
  zone: BaseZone | null
  setHome(zone: BaseZone): void
  setZone(zone: BaseZone): void
  hide(): void
  reveal(): void
  revealed(): boolean
  show(player: BasePlayer): void
  visible(player: BasePlayer): boolean
}

interface BasePlayer {
  name: string
}

class BaseZone {
  id: string
  game: Game

  private _name: string
  private _kind: ZoneKind
  private _owner: BasePlayer | null
  private _cards: BaseCard[]
  private _initialized: boolean

  constructor(game: Game, id: string, name: string, kind: ZoneKind, owner: BasePlayer | null = null) {
    this.id = id
    this.game = game

    this._name = name
    this._kind = kind
    this._owner = owner
    this._cards = []
    this._initialized = false

    const proxy = GameProxy.create(this)
    this.reset.call(proxy)
    return proxy
  }

  cardlist(): BaseCard[] {
    return [...this._cards]
  }

  kind(): ZoneKind {
    return this._kind
  }

  name(): string {
    return this._name
  }

  owner(): BasePlayer | null {
    return this._owner
  }

  initializeCards(cards: BaseCard[]): void {
    if (this._initialized) {
      throw new Error('Zone already initialized')
    }

    this._initialized = true
    this._cards = [...cards]
    for (const card of this._cards) {
      card.setHome(this)
      card.setZone(this)
      this._updateCardVisibility(card)
    }
  }

  reset(): void {
    this._cards = []
    this._initialized = false
  }

  /**
   * Negative indices push from the back of the cards array, the same as with array.splice.
   */
  push(card: BaseCard, index: number): void {
    if (card.zone) {
      (card.zone as BaseZone).remove(card)
    }

    if (index > this._cards.length) {
      throw new Error('Index out of bounds: ' + index)
    }
    this._cards.splice(index, 0, card)
    this._updateCardVisibility(card)

    card.setZone(this)
  }

  peek(index: number = 0): BaseCard | undefined {
    return this._cards.at(index)
  }

  remove(card: BaseCard): void {
    const index = this._cards.findIndex(c => c.id === card.id)
    if (index === -1) {
      throw new Error(`Card (${card.id}) not found in zone (${this.id})`)
    }
    this._cards.splice(index, 1)
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Misc

  nextIndex(): number {
    return this._cards.length
  }

  random(): BaseCard {
    return util.array.select(this._cards, this.game.random)
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Ordering

  shuffle(): void {
    util.array.shuffle(this._cards, this.game.random)
  }

  shuffleTop(count: number): void {
    if (!count || count < 1 || count > this._cards.length) {
      throw new Error(`Invalid count: ${count}`)
    }

    const topCards = this._cards.slice(0, count)
    util.array.shuffle(topCards, this.game.random)

    // Replace the top cards with the shuffled ones using splice
    this._cards.splice(0, count, ...topCards)
  }

  shuffleBottom(count: number): void {
    if (!count || count < 1 || count > this._cards.length) {
      throw new Error(`Invalid count: ${count}`)
    }

    const startIndex = this._cards.length - count
    const bottomCards = this._cards.slice(startIndex)
    util.array.shuffle(bottomCards, this.game.random)

    // Replace the bottom cards with the shuffled ones using splice
    this._cards.splice(startIndex, count, ...bottomCards)
  }

  shuffleBottomVisible(): void {
    throw new Error('not implemented')
  }

  sort(fn: (l: BaseCard, r: BaseCard) => number): void {
    this._cards.sort((l, r) => fn(l, r))
  }

  sortByName(): void {
    this.sort((l, r) => {
      const lName = typeof (l as any).name === 'function' ? (l as any).name() : (l as any).name
      const rName = typeof (r as any).name === 'function' ? (r as any).name() : (r as any).name
      return lName.localeCompare(rName)
    })
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Visibility

  hide(): void {
    this._cards.forEach(card => card.hide())
  }

  reveal(): void {
    this._cards.forEach(card => card.reveal())
  }

  revealNext(): void {
    for (let i = 0; i < this._cards.length; i++) {
      const card = this._cards[i]
      if (!card.revealed()) {
        card.reveal()
        break
      }
    }
  }

  revealRandom(): void {
    const card = util.array.select(this._cards, this.game.random)
    card.reveal()
  }

  show(player: BasePlayer): void {
    this._cards.forEach(card => card.show(player))
  }

  showNext(player: BasePlayer): void {
    for (let i = 0; i < this._cards.length; i++) {
      const card = this._cards[i]
      if (!card.visible(player)) {
        card.show(player)
        break
      }
    }
  }

  showRandom(player: BasePlayer): void {
    const card = util.array.select(this._cards, this.game.random)
    card.show(player)
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Protected
  _updateCardVisibility(card: BaseCard): void {
    switch (this._kind) {
      case ZONE_KIND.public:
        card.reveal()
        break

      case ZONE_KIND.private:
        card.show(this.owner()!)
        break

      case ZONE_KIND.hidden:
        card.hide()
        break

      default:
        throw new Error('Unknown zone kind: ' + this._kind)
    }
  }
}

export { BaseZone, ZONE_KIND, ZoneKind }
