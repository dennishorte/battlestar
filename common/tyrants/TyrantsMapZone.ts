import { TyrantsZone } from './TyrantsZone.js'
import util from '../lib/util.js'
import type { Player, TyrantsGame } from './TyrantsBaseCard.js'

interface MapZoneData {
  name: string
  short: string
  region: string
  size: number
  neutrals: number
  points: number
  start: boolean
  control: {
    influence: number
    points: number
  }
  totalControl: {
    influence: number
    points: number
  }
  neighbors: string[]
  ui?: unknown
}

interface ControlMarker {
  locName: string
  influence: number
  points: number
  total: boolean
  ownerName: string
}

interface Token {
  isTroop: boolean
  isSpy: boolean
  owner: Player | null
}

interface TyrantsMapZone {
  id: string
  short: string
  region: string
  size: number
  neutrals: number
  points: number
  start: boolean
  control: { influence: number; points: number }
  totalControl: { influence: number; points: number }
  neighborNames: string[]
  ui?: unknown
  presence: Player[]

  kind(): string
  addPresence(player: Player): void
  checkHasOpenTroopSpace(): boolean
  checkHasPresence(player: Player): boolean
  chechHasPresence(player: Player): boolean
  checkIsMajorSite(): boolean
  checkIsMinorSite(): boolean
  checkIsSite(): boolean
  getControlMarker(): ControlMarker | undefined
  getEmptySpaces(): number
  getController(): Player | null | undefined
  getTotalController(): Player | undefined
  getTokens(kind: string, player?: Player | 'neutral'): Token[]
  getTroops(player?: Player | 'neutral'): Token[]
  getSpies(player?: Player | 'neutral'): Token[]
  cardlist(): Token[]
  name(): string
}

class TyrantsMapZone extends TyrantsZone {
  constructor(game: TyrantsGame, data: MapZoneData) {
    super(game, `map.${data.name}`, data.name, 'location')

    this.short = data.short
    this.region = data.region
    this.size = data.size
    this.neutrals = data.neutrals
    this.points = data.points
    this.start = data.start
    this.control = data.control
    this.totalControl = data.totalControl
    this.neighborNames = data.neighbors

    this.ui = data.ui

    this.presence = []
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Public interface

  addPresence(player: Player): void {
    util.array.pushUnique(this.presence, player)
  }

  checkHasOpenTroopSpace(): boolean {
    return this.cardlist().filter((card: Token) => card.isTroop).length < this.size
  }

  checkHasPresence(player: Player): boolean {
    return this.presence.includes(player)
  }

  checkIsMajorSite(): boolean {
    return this.checkIsSite() && this.control.influence > 0
  }

  checkIsMinorSite(): boolean {
    return this.checkIsSite() && this.control.influence === 0
  }

  checkIsSite(): boolean {
    return this.points > 0
  }

  getControlMarker(): ControlMarker | undefined {
    if (this.control.influence === 0) {
      return undefined
    }

    const marker: ControlMarker = {
      locName: this.name(),
      influence: 0,
      points: 0,
      total: false,
      ownerName: '',
    }

    const controller = this.getController()
    const totaller = this.getTotalController()

    if (totaller) {
      marker.influence = this.totalControl.influence
      marker.points = this.totalControl.points
      marker.total = true
      marker.ownerName = totaller.name
    }

    else if (controller) {
      marker.influence = this.control.influence
      marker.points = this.control.points
      marker.ownerName = controller.name
    }

    return marker
  }

  getEmptySpaces(): number {
    return this.size - this.getTroops().length
  }

  getController(): Player | null | undefined {
    // Passageways cannot have total controllers
    if (this.points === 0) {
      return null
    }

    // Player with the most troops at the site.
    const playerMap: Record<string, Player | null> = {}  // name: PlayerObject
    const counts: Record<string, number> = {}  // name: count
    for (const troop of this.getTroops()) {
      const owner = troop.owner ? troop.owner.name : 'neutral'
      playerMap[owner] = troop.owner
      counts[owner] = (counts[owner] || 0) + 1
    }

    const mostEntry = util.array.uniqueMaxBy(Object.entries(counts), (entry: [string, number]) => entry[1])
    if (mostEntry && mostEntry[0] !== 'neutral') {
      return playerMap[mostEntry[0]]
    }
    else {
      return undefined
    }
  }

  getTotalController(): Player | undefined {
    // Passageways cannot have total controllers
    if (!this.checkIsSite()) {
      return undefined
    }

    // All troop spaces must be full.
    if (this.getTroops().length !== this.size) {
      return undefined
    }

    // All troops must belong to the same player.
    if (util.array.distinct(this.getTroops().map((t: Token) => t.owner)).length !== 1) {
      return undefined
    }

    const candidate = this.getTroops()[0].owner

    // Player is defined (not neutral)
    if (!candidate) {
      return undefined
    }

    // No enemy spies.
    if (this.getSpies().every((spy: Token) => spy.owner === candidate)) {
      return candidate
    }
    else {
      return undefined
    }
  }

  getTokens(kind: string, player?: Player | 'neutral'): Token[] {
    if (kind === 'troops') {
      return this.getTroops(player)
    }
    else if (kind === 'spies') {
      return this.getSpies(player)
    }
    else {
      return this.getCards(player)
    }
  }

  getTroops(player?: Player | 'neutral'): Token[] {
    return this._filteredTokens((x: Token) => x.isTroop, player)
  }

  getSpies(player?: Player | 'neutral'): Token[] {
    return this._filteredTokens((x: Token) => x.isSpy, player)
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Private functions

  _filteredTokens(fn: (token: Token) => boolean, player?: Player | 'neutral'): Token[] {
    const troops = this
      .cardlist()
      .filter((token: Token) => fn(token))

    if (player === 'neutral') {
      return troops.filter((token: Token) => !token.owner)
    }

    else if (player) {
      return troops.filter((token: Token) => token.owner === player)
    }

    else {
      return troops
    }
  }
}

export { TyrantsMapZone }
export type { MapZoneData, ControlMarker }
