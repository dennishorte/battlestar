import { UltimateBaseCard } from './UltimateBaseCard.js'

import type { Player, Game } from './UltimateBaseCard.js'

interface AchievementData {
  name: string
  shortName?: string
  expansion?: string
  text?: string
  alt?: string
  isSpecialAchievement?: boolean
  isDecree?: boolean
  checkPlayerIsEligible?: (game: Game, player: Player, reduceCost: boolean) => boolean
}

class UltimateAchievement extends UltimateBaseCard {
  version!: number
  declare name: string
  shortName!: string
  expansion!: string
  text!: string
  alt!: string
  isSpecialAchievement!: boolean
  isDecree!: boolean
  checkPlayerIsEligible!: (game: Game, player: Player, reduceCost: boolean) => boolean

  constructor(game: Game, data: AchievementData) {
    super(game, data)

    Object.assign(this, {
      version: 2,
      shortName: '',
      expansion: '',
      text: '',
      alt: '',
      isSpecialAchievement: true,
      isDecree: false,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      checkPlayerIsEligible: (_game: Game, _player: Player, _reduceCost: boolean) => false,

      ...data
    })
  }
}

export { UltimateAchievement }
export type { AchievementData }
