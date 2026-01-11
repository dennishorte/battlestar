import type { Game } from './GameProxy.js'
const { GameProxy } = require('./GameProxy.js')
const util = require('../util.js')

// Forward declarations for circular dependencies
interface BaseZone {
  id: string
  cardlist(): BaseCard[]
  nextIndex(): number
  push(card: BaseCard, index: number): void
}

interface BasePlayer {
  name: string
}

interface BasePlayerManager {
  all(): BasePlayer[]
}

interface CardData {
  id?: string | null
  [key: string]: unknown
}

interface BeforeMoveResult {
  preventDefault?: boolean
  [key: string]: unknown
}

class BaseCard {
  game: Game
  data: CardData

  id: string | null
  owner: BasePlayer | null

  home: BaseZone | null   // Home location (where it returns to)
  zone: BaseZone | null   // Current location
  visibility: BasePlayer[]

  // Proxied properties from game
  declare players: BasePlayerManager

  constructor(game: Game, data: CardData) {
    this.game = game
    this.data = data

    this.id = data.id || null
    this.owner = null

    this.home = null  // Home location (where it returns to)
    this.zone = null  // Current location
    this.visibility = []

    return GameProxy.create(this)
  }

  equals(other: BaseCard): boolean {
    return this.id === other.id
  }

  setHome(zone: BaseZone): void {
    this.home = zone
  }

  setZone(zone: BaseZone): void {
    this.zone = zone
  }

  moveHome(): void {
    this.moveTo(this.home!)
  }

  moveTo(zone: BaseZone, index: number | null = null): this | null {
    const prevZone = this.zone!
    const prevIndex = this.zone!.cardlist().findIndex(card => card.id === this.id)

    let newIndex = index

    // If no index is specified, put the card on the bottom of the zone.
    if (index === null) {
      newIndex = zone.nextIndex()

      // If the card is moving within the same zone, its movement will reduce the total number
      // of items in the zone.
      if (prevZone.id === zone.id) {
        newIndex -= 1
      }
    }

    // The index for the card has been specified, but we need to check if the card is moving within
    // the same zone, and if so, if it is moving to a lower position than where it started.
    else if (prevZone.id === zone.id) {
      if (index > prevIndex) {
        newIndex! -= 1
      }
    }

    const beforeCache: BeforeMoveResult = this._beforeMoveTo(zone, index, prevZone, prevIndex) || {}

    if (beforeCache.preventDefault) {
      return null
    }

    zone.push(this, newIndex!)
    this._afterMoveTo(zone, index, prevZone, prevIndex, beforeCache)

    return this
  }

  moveToTop(zone: BaseZone): void {
    this.moveTo(zone, 0)
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Visibility

  hide(): void {
    this.visibility = []
  }

  reveal(): void {
    this.visibility = this.players.all()
  }

  revealed(): boolean {
    return this.visibility.length === this.players.all().length
  }

  show(player: BasePlayer): void {
    util.array.pushUnique(this.visibility, player)
  }

  visible(player: BasePlayer): boolean {
    return this.visibility.some((other: BasePlayer) => other.name === player.name)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _afterMoveTo(newZone: BaseZone, newIndex: number | null, oldZone: BaseZone, oldIndex: number, beforeCache?: BeforeMoveResult): void {
    // To be overridden by child classes
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _beforeMoveTo(newZone: BaseZone, newIndex: number | null, oldZone: BaseZone, oldIndex: number): BeforeMoveResult | void {
    // To be overridden by child classes
  }
}

module.exports = {
  BaseCard,
}

export { BaseCard, CardData, BeforeMoveResult }
