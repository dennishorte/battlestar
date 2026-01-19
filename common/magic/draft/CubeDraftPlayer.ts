import { BasePlayer } from '../../lib/game/index.js'

import type { BasePlayer as BasePlayerType } from '../../lib/game/index.js'
import type { Pack, PackCard } from './pack.js'

interface PlayerData {
  deckId?: string
  [key: string]: unknown
}

interface DraftGame {
  [key: string]: unknown
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

  constructor(game: DraftGame, data: PlayerData) {
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
