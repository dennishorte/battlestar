const { BaseCard } = require('../lib/game/BaseCard.js')

import type { BaseCard as BaseCardType } from '../lib/game/BaseCard.js'

interface ControlMarker {
  locName: string
  influence: number
  points: number
  total: boolean
  ownerName: string
}

interface TyrantsGame {
  mCheckZoneLimits(zone: unknown): void
  mAdjustPresence(oldZone: unknown, newZone: unknown, card: unknown): void
  mAdjustControlMarkerOwnership(markers: ControlMarker[]): void
  getControlMarkers(): ControlMarker[]
}

interface Player {
  name: string
  [key: string]: unknown
}

interface MoveToData {
  controlMarkers: ControlMarker[]
}

interface TyrantsBaseCard {
  game: TyrantsGame
  owner: Player | null

  getOwnerName(): string
  _afterMoveTo(newZone: unknown, newIndex: number, oldZone: unknown, oldIndex: number, data: MoveToData): void
  _beforeMoveTo(): MoveToData
}

class TyrantsBaseCard extends BaseCard {
  getOwnerName(): string {
    return !this.owner ? 'neutral' : this.owner.name
  }

  _afterMoveTo(newZone: unknown, _newIndex: number, oldZone: unknown, _oldIndex: number, data: MoveToData): void {
    this.game.mCheckZoneLimits(newZone)
    this.game.mAdjustPresence(oldZone, newZone, this)
    this.game.mAdjustControlMarkerOwnership(data.controlMarkers)
  }

  _beforeMoveTo(): MoveToData {
    return {
      controlMarkers: this.game.getControlMarkers(),
    }
  }
}

module.exports = {
  TyrantsBaseCard,
}

export { TyrantsBaseCard, ControlMarker, Player, TyrantsGame }
