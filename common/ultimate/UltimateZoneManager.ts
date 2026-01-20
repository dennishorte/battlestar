import { BaseZoneManager, IZone } from '../lib/game/index.js'
import type { Game as BaseGame } from '../lib/game/GameProxy.js'

import type { UltimatePlayer, BiscuitCounts } from './UltimatePlayer.js'

interface UltimateUtils {
  colors(): string[]
}

interface Zone extends IZone {
  id: string
  biscuits(): BiscuitCounts
}

interface Game extends BaseGame {
  util: UltimateUtils
}

class UltimateZoneManager extends BaseZoneManager<Game> {

  byDeck(exp: string, age: number): Zone {
    const id = `decks.${exp}.${age}`
    return this.byId(id)
  }

  colorStacks(player: UltimatePlayer): Zone[] {
    return this.game.util.colors().map((color: string) => this.byPlayer(player, color))
  }

  stacksWithBiscuit(player: UltimatePlayer, biscuit: keyof BiscuitCounts): number[] {
    return Object
      .values(player.biscuitsByColor())
      .map((biscuits: BiscuitCounts) => biscuits[biscuit])
      .filter((num: number) => num > 0)
  }
}

export { UltimateZoneManager }
