import type { Game } from './GameProxy.js'
import type { ICard, IPlayer, IZone, ZoneKind } from './interfaces.js'
import { BaseZone } from './BaseZone.js'
import { GameProxy } from './GameProxy.js'

// For backwards compatibility, alias IZone as BaseZoneInterface
type BaseZoneInterface = IZone

type ZoneConstructor<TZone extends IZone = IZone> = new (game: Game, id: string, name: string, kind: ZoneKind, owner?: IPlayer | null) => TZone

class BaseZoneManager<
  TGame extends Game = Game,
  TZone extends IZone = IZone
> {
  game: TGame
  protected _zoneConstructor: ZoneConstructor<TZone>
  protected _zones: Record<string, TZone>

  constructor(game: TGame) {
    this._zoneConstructor = BaseZone as unknown as ZoneConstructor<TZone>
    this.game = game
    this._zones = {}

    return GameProxy.create(this)
  }

  create(...args: [Game, string, string, ZoneKind, (IPlayer | null)?]): TZone {
    const zone = new this._zoneConstructor(...args)
    this.register(zone)
    return zone
  }

  register(zone: TZone): void {
    if (Object.hasOwn(this._zones, zone.id)) {
      throw new Error('Duplicate zone id: ' + zone.id)
    }
    this._zones[zone.id] = zone
  }

  reset(): void {
    this._zones = {}
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Getters

  all(): TZone[] {
    return Object.values(this._zones)
  }

  byCard(card: ICard): TZone | null {
    return card.zone as TZone | null
  }

  byId(id: string): TZone {
    return this._zones[id]
  }

  byPlayer(player: IPlayer, zoneName: string): TZone {
    const id = `players.${player.name}.${zoneName}`
    return this.byId(id)
  }
}

export { BaseZoneManager, ZoneConstructor, BaseZoneInterface }
