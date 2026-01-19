import { BaseZone, ZONE_KIND, ZoneKind } from '../lib/game/index.js'
import type { Game as BaseGame } from '../lib/game/GameProxy.js'

import type { UltimatePlayer, BiscuitCounts } from './UltimatePlayer.js'

interface UltimateUtils {
  parseBiscuits(biscuitString: string): BiscuitCounts
  combineBiscuits(left: BiscuitCounts, right: BiscuitCounts): BiscuitCounts
  emptyBiscuits(): BiscuitCounts
}

interface Card {
  visibleBiscuits(): string
}

interface KarmaInfo {
  impl: {
    func: (game: Game, player: UltimatePlayer) => Card[]
  }
}

interface Game extends BaseGame {
  util: UltimateUtils
  getInfoByKarmaTrigger(player: UltimatePlayer, trigger: string): KarmaInfo[]
}

interface Players {
  byZone(zone: UltimateZone): UltimatePlayer | null
}

class UltimateZone extends BaseZone<Game, Card, UltimatePlayer> {
  color: string | undefined
  splay: string | undefined
  declare players: Players
  declare util: UltimateUtils

  constructor(game: Game, id: string, name: string, kind: ZoneKind, owner: UltimatePlayer | null = null) {
    super(game, id, name, kind, owner)

    this.color = undefined
    this.splay = undefined
  }

  biscuits(): BiscuitCounts {
    return this
      .cardlist()
      .map((card: Card) => card.visibleBiscuits())
      .map((biscuitString: string) => this.game.util.parseBiscuits(biscuitString))
      .reduce((l: BiscuitCounts, r: BiscuitCounts) => this.game.util.combineBiscuits(l, r), this.util.emptyBiscuits())
  }

  cardlist(opts: { noKarma?: boolean } = {}): Card[] {
    for (const zoneName of ['hand', 'forecast', 'score']) {
      if (this.name().endsWith('.' + zoneName) && !opts.noKarma) {
        const karmaInfos = this.game.getInfoByKarmaTrigger(this.player()!, `list-${zoneName}`)
        if (karmaInfos.length === 1) {
          return karmaInfos[0].impl.func(this.game, this.player()!)
        }
        else if (karmaInfos.length > 1) {
          throw new Error(`Multiple list-${zoneName} karmas`)
        }
        else {
          // Fall through
        }
      }
    }

    return super.cardlist()
  }

  isPlayerAchievementsZone(): boolean {
    return Boolean(this.owner) && this.id.endsWith('.achievements')
  }

  isArtifactZone(): boolean {
    return Boolean(this.owner) && this.id.endsWith('.artifact')
  }

  isColorZone(): boolean {
    return Boolean(this.color)
  }

  isHandZone(): boolean {
    return Boolean(this.owner) && this.id.endsWith('.hand')
  }

  isMuseumZone(): boolean {
    return Boolean(this.owner) && this.id.endsWith('.museum')
  }

  player(): UltimatePlayer | null {
    return this.players.byZone(this)
  }

  setCards(cards: Card[]): void {
    this._cards = cards
  }

  numVisibleCards(): number {
    return this.visibleCards().length
  }

  visibleCards(): Card[] {
    if (this._cards.length === 0) {
      return []
    }
    else if (this.splay === 'none') {
      return this._cards.slice(0, 1)
    }
    else {
      return this.cardlist()
    }

  }
}

export { UltimateZone }
