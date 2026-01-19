import { BaseCard, BeforeMoveResult } from '../lib/game/BaseCard.js'
import { BaseZone } from '../lib/game/BaseZone.js'
import type { Game as BaseGame } from '../lib/game/GameProxy.js'

interface ControlMarker {
  locName: string
  influence: number
  points: number
  total: boolean
  ownerName: string
}

interface TyrantsGame extends BaseGame {
  mCheckZoneLimits(zone: unknown): void
  mAdjustPresence(oldZone: unknown, newZone: unknown, card: unknown): void
  mAdjustControlMarkerOwnership(markers: ControlMarker[]): void
  getControlMarkers(): ControlMarker[]
}

interface Player {
  name: string
  [key: string]: unknown
}

interface MoveToData extends BeforeMoveResult {
  controlMarkers: ControlMarker[]
}

class TyrantsBaseCard extends BaseCard<TyrantsGame, BaseZone> {
  getOwnerName(): string {
    return !this.owner ? 'neutral' : this.owner.name
  }

  override _afterMoveTo(newZone: BaseZone, _newIndex: number | null, oldZone: BaseZone, _oldIndex: number, data?: BeforeMoveResult): void {
    const moveData = data as MoveToData
    this.game.mCheckZoneLimits(newZone)
    this.game.mAdjustPresence(oldZone, newZone, this)
    this.game.mAdjustControlMarkerOwnership(moveData.controlMarkers)
  }

  override _beforeMoveTo(_newZone: BaseZone, _newIndex: number | null, _oldZone: BaseZone, _oldIndex: number): MoveToData {
    return {
      controlMarkers: this.game.getControlMarkers(),
    }
  }
}

export { TyrantsBaseCard }
export type { ControlMarker, Player, TyrantsGame }
