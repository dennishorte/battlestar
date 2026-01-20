import { BasePlayer, PlayerData as BasePlayerData } from '../../lib/game/index.js'
import { Game } from '../../lib/game.js'

import type { Pack, PackCard } from './pack.js'

interface CubeDraftPlayerData extends BasePlayerData {
  deckId?: string
}

class CubeDraftPlayer extends BasePlayer {
  deckId: string | undefined
  draftComplete: boolean
  picked: PackCard[]
  waitingPacks: Pack[]
  nextRoundPacks: Pack[]
  unopenedPacks: Pack[]
  scarredRounds: number[]
  scarredCardId: string | null

  constructor(game: Game, data: CubeDraftPlayerData) {
    super(game, data)

    this.deckId = data.deckId
    this.draftComplete = false
    this.picked = []
    this.waitingPacks = []
    this.nextRoundPacks = []
    this.unopenedPacks = []
    this.scarredRounds = []
    this.scarredCardId = null
  }
}


export { CubeDraftPlayer }
