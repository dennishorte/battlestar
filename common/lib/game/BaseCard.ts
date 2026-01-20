import type { Game } from './GameProxy.js'
import type {
  ICard,
  IZone,
  IPlayer,
  IPlayerManager,
  CardData,
  BeforeMoveResult,
} from './interfaces.js'
import { GameProxy } from './GameProxy.js'
import util from '../util.js'

class BaseCard<
  TGame extends Game = Game,
  TZone extends IZone = IZone,
  TOwner extends IPlayer = IPlayer
> {
  game: TGame
  data: CardData

  id: string | null
  owner: TOwner | null

  home: TZone | null   // Home location (where it returns to)
  zone: TZone | null   // Current location
  visibility: IPlayer[]

  // Proxied properties from game
  declare players: IPlayerManager

  constructor(game: TGame, data: CardData) {
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

  setHome(zone: IZone): void {
    this.home = zone as TZone
  }

  setZone(zone: IZone): void {
    this.zone = zone as TZone
  }

  moveHome(): void {
    this.moveTo(this.home!)
  }

  moveTo(zone: IZone, index: number | null = null): this | null {
    const prevZone = this.zone!
    const prevIndex = this.zone!.cardlist().findIndex(card => (card as ICard).id === this.id)

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

    const beforeCache: BeforeMoveResult = this._beforeMoveTo(zone as TZone, index, prevZone as TZone, prevIndex) || {}

    if (beforeCache.preventDefault) {
      return null
    }

    zone.push(this, newIndex!)
    this._afterMoveTo(zone as TZone, index, prevZone as TZone, prevIndex, beforeCache)

    return this
  }

  moveToTop(zone: IZone): void {
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

  show(player: IPlayer): void {
    util.array.pushUnique(this.visibility, player)
  }

  visible(player: IPlayer): boolean {
    return this.visibility.some((other: IPlayer) => other.name === player.name)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _afterMoveTo(newZone: TZone, newIndex: number | null, oldZone: TZone, oldIndex: number, beforeCache?: BeforeMoveResult): void {
    // To be overridden by child classes
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _beforeMoveTo(newZone: TZone, newIndex: number | null, oldZone: TZone, oldIndex: number): BeforeMoveResult | void {
    // To be overridden by child classes
  }
}

export { BaseCard, CardData, BeforeMoveResult }
