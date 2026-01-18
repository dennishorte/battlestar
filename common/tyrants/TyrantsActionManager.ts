const { BaseActionManager } = require('../lib/game/index.js')

import type { TyrantsPlayer } from './TyrantsPlayer.js'

interface Card {
  id: string
  name: string
  zone: Zone
  owner: TyrantsPlayer | null
  moveTo(zone: Zone, position?: number): Card
}

interface Zone {
  id: string
  cardlist(): Card[]
  peek(): Card | null
}

interface ZoneManager {
  byId(id: string): Zone
  byPlayer(player: TyrantsPlayer, zone: string): Zone
}

interface CardManager {
  byId(id: string): Card
  byZone(zone: string): Card[]
  byPlayer(player: TyrantsPlayer, zone: string): Card[]
}

interface PlayerManager {
  all(): TyrantsPlayer[]
  other(player: TyrantsPlayer): TyrantsPlayer[]
  current(): TyrantsPlayer
  opponents(player: TyrantsPlayer): TyrantsPlayer[]
}

interface Log {
  add(entry: { template: string; args?: Record<string, unknown> }): void
  addNoEffect(): void
  addDoNothing(player: TyrantsPlayer): void
  indent(): void
  outdent(): void
}

interface GameState {
  turn: number
  endOfTurnActions: unknown[]
}

interface Game {
  zones: ZoneManager
  cards: CardManager
  players: PlayerManager
  log: Log
  state: GameState
}

class TyrantsActionManager extends BaseActionManager {
  game!: Game
  zones!: ZoneManager
  cards!: CardManager
  players!: PlayerManager
  log!: Log
  state!: GameState

  constructor(game: Game) {
    super(game)
  }

  // Action methods will be moved here from tyrants.ts
}

module.exports = {
  TyrantsActionManager,
}

export { TyrantsActionManager }
