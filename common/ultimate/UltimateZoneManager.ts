import { BaseZoneManager } from '../lib/game/index.js'
import type { Game as BaseGame } from '../lib/game/GameProxy.js'

import type { UltimatePlayer, BiscuitCounts } from './UltimatePlayer.js'
import type { UltimateZone } from './UltimateZone.js'

// Use actual UltimateZone type
type Zone = UltimateZone

interface UltimateUtils {
  colors(): string[]
}

interface Game extends BaseGame {
  util: UltimateUtils
}

class UltimateZoneManager extends BaseZoneManager<any, Zone> {

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
