import type { Game } from './GameProxy.js'
import { BaseZone, ZoneKind } from './BaseZone.js'
import { GameProxy } from './GameProxy.js'

// Forward declarations for circular dependencies
interface BasePlayer {
  name: string
}

interface BaseCard {
  zone: BaseZoneInterface | null
}

interface BaseZoneInterface {
  id: string
  cardlist(): BaseCard[]
}

type ZoneConstructor = new (game: Game, id: string, name: string, kind: ZoneKind, owner?: BasePlayer | null) => BaseZoneInterface

class BaseZoneManager {
  game: Game
  protected _zoneConstructor: ZoneConstructor
  protected _zones: Record<string, BaseZoneInterface>

  constructor(game: Game) {
    this._zoneConstructor = BaseZone
    this.game = game
    this._zones = {}

    return GameProxy.create(this)
  }

  create(...args: [Game, string, string, ZoneKind, (BasePlayer | null)?]): BaseZoneInterface {
    const zone = new this._zoneConstructor(...args)
    this.register(zone)
    return zone
  }

  register(zone: BaseZoneInterface): void {
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

  all(): BaseZoneInterface[] {
    return Object.values(this._zones)
  }

  byCard(card: BaseCard): BaseZoneInterface | null {
    return card.zone
  }

  byId(id: string): BaseZoneInterface {
    return this._zones[id]
  }

  byPlayer(player: BasePlayer, zoneName: string): BaseZoneInterface {
    const id = `players.${player.name}.${zoneName}`
    return this.byId(id)
  }
}

export { BaseZoneManager, ZoneConstructor }
