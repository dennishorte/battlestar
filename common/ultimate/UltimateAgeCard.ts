import { UltimateBaseCard } from './UltimateBaseCard.js'
import util from '../lib/util.js'

import type { Player } from './UltimateBaseCard.js'

interface KarmaImpl {
  trigger: string | string[]
  kind?: string
  decree?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matches?: (...args: any[]) => boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  func?: (...args: any[]) => unknown
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DogmaFunction = (game: any, player: any, context?: any) => void

interface AgeCardData {
  name: string
  color?: string
  age?: number
  visibleAge?: number | null
  expansion?: string
  biscuits?: string
  dogmaBiscuit?: string
  echo?: string | string[]
  karma?: string[]
  dogma?: string[]
  dogmaImpl?: DogmaFunction[]
  echoImpl?: DogmaFunction | DogmaFunction[]
  karmaImpl?: KarmaImpl[]
}

interface Zone {
  id: string
  splay: string
  owner(): Player | null
  isColorZone(): boolean
}

interface UltimateUtils {
  parseBiscuits(biscuitString: string): Record<string, number>
  getAsArray<T>(obj: unknown, key: string): T[]
}

interface Game {
  zones: {
    byPlayer(player: Player, zone: string): Zone
  }
  cards: {
    top(player: Player, color: string): { id: string } | null
  }
  util: UltimateUtils
}

interface VisibleEffectsResult {
  card: UltimateAgeCard
  texts: string[]
  impls: DogmaFunction[]
}

interface KarmaInfo {
  card: UltimateAgeCard
  index: number
  text: string
  impl: KarmaImpl
}

class UltimateAgeCard extends UltimateBaseCard {
  version!: number
  declare name: string
  color!: string
  age!: number
  visibleAge!: number | null
  expansion!: string
  biscuits!: string
  dogmaBiscuit!: string
  echo!: string[]
  karma!: string[]
  dogma!: string[]
  dogmaImpl!: Array<(game: unknown, player: Player) => void>
  echoImpl!: Array<(game: unknown, player: Player) => void>
  karmaImpl!: KarmaImpl[]
  owner!: Player | null
  zone!: Zone
  declare game: Game

  constructor(game: Game, data: AgeCardData) {
    super(game, data)

    Object.assign(this, {
      version: 2,
      color: '',
      age: 1,
      visibleAge: null,
      expansion: '',
      biscuits: '',
      dogmaBiscuit: '',
      echo: [],
      karma: [],
      dogma: [],
      dogmaImpl: [],
      echoImpl: [],
      karmaImpl: [],
      ...data,
    })
  }

  getSplay(): string {
    if (this.owner) {
      if (this.isTopCardLoose()) {
        return 'top'
      }
      else {
        return this.game.zones.byPlayer(this.owner, this.color).splay
      }
    }
    else {
      return 'top'
    }
  }

  checkBiscuitIsVisible(biscuit: string): boolean {
    if (biscuit === 'h') {
      // m also counts as an h
      const mIsVisible = this.checkBiscuitIsVisible('m')
      if (mIsVisible) {
        return true
      }
    }

    const biscuitIndices: number[] = []
    for (let i = 0; i < this.biscuits.length; i++) {
      if (this.biscuits[i] === biscuit) {
        biscuitIndices.push(i)
      }
    }

    const splay = this.getSplay()

    return biscuitIndices.some(biscuitIndex => {
      switch (splay) {
        case 'left': return biscuitIndex === 3 || biscuitIndex === 5
        case 'right': return biscuitIndex === 0 || biscuitIndex === 1
        case 'up': return biscuitIndex === 1 || biscuitIndex === 2 || biscuitIndex === 3
        case 'aslant': return biscuitIndex === 0 || biscuitIndex === 1 || biscuitIndex === 2 || biscuitIndex === 3
        case 'top': return biscuitIndex !== -1
        default: return false
      }
    })
  }

  checkEchoIsVisible(): boolean {
    return this.checkBiscuitIsVisible('&')
  }

  checkHasDemandExplicit(): boolean {
    return this
      .dogma
      .some(text => text.toLowerCase().startsWith('i demand'))
  }

  checkHasCompelExplicit(): boolean {
    return this
      .dogma
      .some(text => text.toLowerCase().startsWith('i compel'))
  }

  checkHasDemand(): boolean {
    return this.checkHasDemandExplicit() || this.checkHasCompelExplicit()
  }

  checkHasDogma(): boolean {
    return this.dogma && this.dogma.length > 0
  }

  checkHasEcho(): boolean {
    return this.echo && this.echo.length > 0
  }

  checkHasKarma(): boolean {
    return this.karma && this.karma.length > 0
  }

  checkHasShare(): boolean {
    const shareDogmaEffect = this.dogma.some(text => {
      const lowercase = text.toLowerCase()
      return !lowercase.startsWith('i demand') && !lowercase.startsWith('i compel')
    })
    const shareEchoEffect = !!this.echo
    return shareDogmaEffect || shareEchoEffect
  }

  checkIsAgeCard(): boolean {
    return true
  }

  checkIsArtifact(): boolean {
    return this.expansion === 'arti'
  }

  checkIsCity(): boolean {
    return this.expansion === 'city'
  }

  checkIsEchoes(): boolean {
    return this.expansion === 'echo'
  }

  checkIsFigure(): boolean {
    return this.expansion === 'figs'
  }

  checkIsOnPlayerBoard(player?: Player): boolean {
    if (!this.zone || !this.zone.owner) {
      return false
    }

    // Is on any player board?
    if (!player) {
      return this.zone.isColorZone()
    }

    // Is on a particular player board?
    // Note: zone.owner is a function, so we need to call it
    else {
      const zoneOwner = this.zone.owner()
      return Boolean(zoneOwner && zoneOwner.id === player.id && this.zone.isColorZone())
    }
  }

  checkHasBonus(): boolean {
    return this.getBonuses().length > 0
  }

  checkHasDiscoverBiscuit(): boolean {
    if (this.biscuits.length < 6) {
      return false
    }

    const biscuit = this.biscuits[4]
    return 'lciskfp'.includes(biscuit)
  }

  isTopCardLoose(): boolean {
    if (!this.owner) {
      return true
    }

    if (!this.zone.isColorZone()) {
      return true
    }

    return this.isTopCardStrict()
  }

  isTopCardStrict(): boolean {
    return this.game.cards.top(this.owner!, this.color)?.id === this.id
  }

  checkSharesBiscuit(other: UltimateAgeCard): boolean {
    const biscuits = 'lciskfp'.split('')
    for (const biscuit of biscuits) {
      if (this.checkHasBiscuit(biscuit) && other.checkHasBiscuit(biscuit)) {
        return true
      }
    }
    return false
  }

  getAge(): number {
    return this.checkIsOnPlayerBoard() ? (this.visibleAge || this.age) : this.age
  }

  getBiscuitCount(biscuit: string): number {
    return this.biscuits.split(biscuit).length - 1
  }

  visibleBiscuitsParsed(): Record<string, number> {
    return this.game.util.parseBiscuits(this.visibleBiscuits())
  }

  visibleBiscuits(): string {
    const splay = this.getSplay()

    // If this is a top card, return all of its biscuits
    if (splay === 'top') {
      if (this.biscuits.length === 4) {
        return this.biscuits
      }
      else {
        // This ensures the meld biscuits from cities are executed in the correct order.
        return this.biscuits[0] + this.biscuits.slice(4, 6) + this.biscuits.slice(1, 4)
      }
    }

    if (splay === 'none') {
      return ''
    }
    else if (splay === 'left') {
      return this.biscuits.slice(3,4) + this.biscuits.slice(5,6)
    }
    else if (splay === 'right') {
      return this.biscuits.slice(0, 2)
    }
    else if (splay === 'up') {
      return this.biscuits.slice(1, 4)
    }
    else if (splay === 'aslant') {
      return this.biscuits.slice(0, 4)
    }
    else {
      throw new Error(`Unknown splay type: ${splay}`)
    }
  }

  getBonuses(): number[] {
    const rx = /([abt1-9])/g
    const matches = this
      .visibleBiscuits()
      .match(rx)

    if (!matches) {
      return []
    }

    else {
      return matches.map(bonus => {
        if (bonus === 't') {
          return 12
        }
        else {
          return parseInt(bonus, 16)
        }
      })
    }
  }

  getHexIndex(): number {
    if (this.biscuits.includes('m')) {
      return this.biscuits.indexOf('m')
    }
    else {
      return this.biscuits.indexOf('h')
    }
  }

  getKarmaInfo(trigger: string): KarmaInfo[] {
    const matches: KarmaInfo[] = []
    for (let i = 0; i < this.karma.length; i++) {
      const impl = this.karmaImpl[i]
      const triggers = util.getAsArray(impl, 'trigger')
      if (triggers.includes(trigger)) {
        matches.push({
          card: this,
          index: i,
          text: this.karma[i],
          impl: this.karmaImpl[i],
        })
      }
    }
    return matches
  }

  getImpl(kind: string): Array<(game: unknown, player: Player) => void> | KarmaImpl[] {
    if (kind.startsWith('karma')) {
      kind = kind.substr(6)
      const impl = this.karmaImpl.find(impl => impl.trigger === kind)

      // Other implementation types return the entire array. Since karma impls
      // are a non-homogenous array, they they need to grab the correct element
      // and re-wrap it in an array to match the format used by other impl kinds.
      if (impl) {
        return [impl]
      }
      else {
        return []
      }
    }
    else {
      return (this as unknown as Record<string, Array<(game: unknown, player: Player) => void>>)[`${kind}Impl`]
    }
  }

  inHand(player: Player): boolean {
    return this.owner === player && this.zone.id.endsWith('hand')
  }

  visibleEffects(kind: string, opts: { selfExecutor?: boolean } = {}): VisibleEffectsResult | undefined {
    const isTop = this.isTopCardLoose() || this.zone.id.endsWith('.artifact')

    if (kind === 'dogma') {
      if ((opts.selfExecutor || isTop) && this.dogma.length > 0) {
        return {
          card: this,
          texts: this.dogma,
          impls: this.getImpl('dogma') as Array<(game: unknown, player: Player) => void>,
        }
      }
    }

    else if (kind === 'echo') {
      const texts: string[] = []
      const impls: Array<(game: unknown, player: Player) => void> = []

      if (this.checkEchoIsVisible()) {
        for (const text of util.getAsArray(this, 'echo')) {
          texts.push(text)
        }
        for (const impl of util.getAsArray(this, 'echoImpl')) {
          impls.push(impl)
        }
      }

      if (texts.length > 0) {
        return {
          card: this,
          texts,
          impls,
        }
      }
    }

    else {
      throw new Error(`Unknown effect type: ${kind}`)
    }

    return undefined
  }
}

export { UltimateAgeCard }
export type { AgeCardData, KarmaImpl, KarmaInfo, VisibleEffectsResult }
