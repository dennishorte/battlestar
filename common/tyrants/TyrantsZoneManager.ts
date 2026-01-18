const { BaseZoneManager } = require('../lib/game/index.js')
const { TyrantsZone } = require('./TyrantsZone.js')

import type { TyrantsPlayer } from './TyrantsPlayer.js'

interface Zone {
  id: string
  cardlist(): unknown[]
}

interface Game {
  // Game reference
}

class TyrantsZoneManager extends BaseZoneManager {
  game!: Game

  constructor(game: Game) {
    super(game)
    this._zoneConstructor = TyrantsZone
  }
}

module.exports = {
  TyrantsZoneManager,
}

export { TyrantsZoneManager }
