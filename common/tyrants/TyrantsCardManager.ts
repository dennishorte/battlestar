const { BaseCardManager } = require('../lib/game/index.js')

import type { TyrantsPlayer } from './TyrantsPlayer.js'

interface Card {
  id: string
}

interface Zone {
  cardlist(): Card[]
}

interface ZoneManager {
  byId(id: string): Zone
}

interface Game {
  zones: ZoneManager
}

class TyrantsCardManager extends BaseCardManager {
  game!: Game
  zones!: ZoneManager

  constructor(...args: unknown[]) {
    super(...args)
  }
}

module.exports = {
  TyrantsCardManager,
}

export { TyrantsCardManager }
