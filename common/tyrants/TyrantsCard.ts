const { TyrantsBaseCard } = require('./TyrantsBaseCard.js')

import type { TyrantsBaseCard as TyrantsBaseCardType, TyrantsGame, Player } from './TyrantsBaseCard.js'

interface TyrantsCardData {
  id?: string
  name?: string
  aspect?: string
  race?: string
  expansion?: string
  cost?: number
  points?: number
  innerPoints?: number
  count?: number
  text?: string[]
  isTroop?: boolean
  isSpy?: boolean
  autoplay?: boolean
  triggers?: CardTrigger[]
  impl?: (game: TyrantsGame, player: Player, opts: { card: TyrantsCard }) => void
  [key: string]: unknown
}

interface CardTrigger {
  kind: string
  impl: (game: TyrantsGame, player: Player, opts: { card: TyrantsCard; forcedBy?: string }) => unknown
}

interface TyrantsCard extends TyrantsBaseCardType {
  name: string
  aspect: string | undefined
  race: string | undefined
  expansion: string | undefined
  cost: number | undefined
  points: number | undefined
  innerPoints: number | undefined
  count: number | undefined
  text: string[]
  isTroop: boolean
  isSpy: boolean
  autoplay: boolean
  triggers?: CardTrigger[]
  impl: (game: TyrantsGame, player: Player, opts: { card: TyrantsCard }) => void
}

class TyrantsCard extends TyrantsBaseCard {
  constructor(game: TyrantsGame, data: TyrantsCardData) {
    super(game, data)

    Object.assign(this, {
      name: undefined,
      aspect: undefined,
      race: undefined,
      expansion: undefined,
      cost: undefined,
      points: undefined,
      innerPoints: undefined,
      count: undefined,
      text: [],
      isTroop: false,
      isSpy: false,
      autoPlay: false,
      ...data,
    })
  }
}

module.exports = {
  TyrantsCard,
}

export { TyrantsCard, TyrantsCardData, CardTrigger }
