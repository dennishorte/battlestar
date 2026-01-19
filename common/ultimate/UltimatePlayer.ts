import { BasePlayer } from '../lib/game/index.js'

interface BiscuitCounts {
  c: number
  f: number
  i: number
  k: number
  l: number
  s: number
  p: number
}

interface Zone {
  biscuits(): BiscuitCounts
}

interface UltimateUtils {
  combineBiscuits(left: BiscuitCounts, right: BiscuitCounts): BiscuitCounts
  colors(): string[]
}

interface Game {
  zones: {
    colorStacks(player: UltimatePlayer): Zone[]
  }
  util: UltimateUtils
  getInfoByKarmaTrigger(player: UltimatePlayer, trigger: string): KarmaInfo[]
  aCardEffect(player: UltimatePlayer, info: KarmaInfo, opts: { biscuits: BiscuitCounts }): BiscuitCounts
}

interface KarmaInfo {
  card: unknown
  impl: unknown
}

class UltimatePlayer extends BasePlayer {
  id!: string
  name!: string
  game!: Game
  zones!: {
    byPlayer(player: UltimatePlayer, zone: string): Zone
  }

  biscuits(): BiscuitCounts {
    const boardBiscuits = this
      .game
      .zones
      .colorStacks(this)
      .map(zone => zone.biscuits())
      .reduce((l, r) => this.game.util.combineBiscuits(l, r))

    return this
      .game
      .getInfoByKarmaTrigger(this, 'calculate-biscuits')
      .map(info => this.game.aCardEffect(this, info, { biscuits: boardBiscuits }))
      .reduce((l, r) => this.game.util.combineBiscuits(l, r), boardBiscuits)
  }

  biscuitsByColor(): Record<string, BiscuitCounts> {
    const output: Record<string, BiscuitCounts> = {}
    for (const color of this.game.util.colors()) {
      output[color] = this.zones.byPlayer(this, color).biscuits()
    }
    return output
  }
}

export { UltimatePlayer }
export type { BiscuitCounts }
