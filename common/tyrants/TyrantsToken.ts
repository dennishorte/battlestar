const { TyrantsBaseCard } = require('./TyrantsBaseCard.js')

import type { TyrantsBaseCard as TyrantsBaseCardType, TyrantsGame, Player } from './TyrantsBaseCard.js'

interface TyrantsToken {
  name: string
  isTroop: boolean
  isSpy: boolean

  isNeutral(): boolean
  isOtherPlayer(player: Player): boolean
}

class TyrantsToken extends TyrantsBaseCard {
  constructor(game: TyrantsGame, id: string, name: string) {
    super(game, { id })

    this.name = name
    this.isTroop = false
    this.isSpy = false
  }

  isNeutral(): boolean {
    return !this.owner
  }

  isOtherPlayer(player: Player): boolean {
    return Boolean(this.owner) && this.owner !== player
  }
}

module.exports = {
  TyrantsToken,
}

export { TyrantsToken }
