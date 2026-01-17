import type { BiscuitCounts } from '../UltimatePlayer.js'

interface Player {
  id: string
  name: string
}

interface VisibleEffectsResult {
  card: Card
  texts: string[]
  impls: Array<(game: unknown, player: Player) => void>
}

interface Card {
  id: string
  name: string
  color: string
  owner: Player | null
  dogmaBiscuit: string
  biscuits: string
  visibleEffects(kind: string): VisibleEffectsResult | undefined
  visibleBiscuitsParsed(): BiscuitCounts
  checkIsCity(): boolean
  checkHasShare(): boolean
  getAge(): number
}

interface Zone {
  id: string
}

interface ZoneManager {
  byPlayer(player: Player, zone: string): Zone
}

interface CardManager {
  tops(player: Player): Card[]
  byPlayer(player: Player, zone: string): Card[]
  top(player: Player, color: string): Card
}

interface PlayerManager {
  all(): Player[]
  other(player: Player): Player[]
}

interface Log {
  add(entry: { template: string; classes?: string[]; args?: Record<string, unknown> }): void
  indent(): void
  outdent(): void
}

interface GameStats {
  dogmaActions: Record<string, number>
}

interface DogmaInfo {
  leader: Player
  card: Card
  shared: boolean
  earlyTerminate: boolean
  biscuits: Record<string, BiscuitCounts>
  featuredBiscuit: string
  sharing: Player[]
  demanding: Player[]
  acting: Player | null
  isDemandEffect: boolean
  theBigBangChange: boolean
  opts: DogmaOptions
  soleMajorityPlayerId?: string
  mayIsMust?: boolean
  recalculateSharingAndDemanding(): void
}

interface GameSettings {
  version: number
}

interface Game {
  aKarma(player: Player, trigger: string, opts?: Record<string, unknown>): string | undefined
  aOneEffect(player: Player, card: Card, text: string, impl: unknown, opts: Record<string, unknown>): void
  getBiscuits(): Record<string, BiscuitCounts>
  getScore(player: Player): number
  getExpansionList(): string[]
  getVisibleEffectsByColor(player: Player | null, color: string, kind: string): VisibleEffectsResult[]
  mResetDogmaInfo(): void
  stats: GameStats
  players: PlayerManager
  cards: CardManager
  settings: GameSettings
}

interface ActionManager {
  game: Game
  state: {
    dogmaInfo: DogmaInfo
    didEndorse?: boolean
  }
  zones: ZoneManager
  cards: CardManager
  players: PlayerManager
  log: Log
  util: {
    emptyBiscuits(): BiscuitCounts
    combineBiscuits(left: BiscuitCounts, right: BiscuitCounts): BiscuitCounts
  }
  acted(player: Player): void
  draw(player: Player, opts?: { exp?: string; share?: boolean; featuredBiscuit?: string }): Card
  chooseAndJunk(player: Player, choices: string[], opts?: { title?: string }): void
}

interface DogmaOptions {
  auspice?: boolean
  artifact?: boolean
  endorsed?: boolean
  foreseen?: boolean
}

function DogmaAction(this: ActionManager, player: Player, card: Card, opts: DogmaOptions = {}): void {
  this.log.add({
    template: '{player} activates the dogma effects of {card}',
    classes: ['player-action'],
    args: { player, card }
  })
  this.log.indent()

  DogmaHelper.call(this, player, card, opts)

  this.log.outdent()

  this.game.mResetDogmaInfo()
}

function DogmaHelper(this: ActionManager, player: Player, card: Card, opts: DogmaOptions = {}): void {
  _statsRecordDogmaActions.call(this, player, card)

  const biscuits = _getDogmaBiscuits.call(this, player, card, opts)
  const featuredBiscuit = opts.auspice ? 'p' : card.dogmaBiscuit
  const { sharing, demanding } = _getSharingAndDemanding.call(
    this,
    player,
    featuredBiscuit,
    biscuits,
  )

  const self = this

  this.state.dogmaInfo = {
    leader: player,
    card: card,
    shared: false,
    earlyTerminate: false,

    biscuits,          // Cached biscuits at the beginning of the dogma effect.
    featuredBiscuit,   // Featured biscuit being used for determing sharing/demands, etc.

    sharing,   // Array of players who will share during this dogma action.
    demanding, // Array of players who will be subject to demands during this dogma action.

    // Player who is currently executing an effect.
    // This can be a player who is sharing or being demands.
    acting: null,

    // Tracks if the current effect is a demand effect.
    isDemandEffect: false,

    // Special case for The Big Bang
    theBigBangChange: false,

    opts,

    // Needed for Muhammad Yunus
    recalculateSharingAndDemanding() {
      const { sharing, demanding } = _getSharingAndDemanding.call(
        self,
        player,
        featuredBiscuit,
        biscuits,
      )
      self.state.dogmaInfo.sharing = sharing
      self.state.dogmaInfo.demanding = demanding
    },
  }

  const karmaKind = this.game.aKarma(player, 'dogma', { ...opts, card })
  if (karmaKind === 'would-instead') {
    this.acted(player)
    return
  }

  // Sargon of Akkad, for example, modifies who can share.
  for (const player2 of this.game.players.all()) {
    this.game.aKarma(player2, 'share-eligibility', { ...opts, card, leader: player })
  }

  _logSharing.call(this)
  _executeEffects.call(this, player, card, opts)

  if (this.state.dogmaInfo.earlyTerminate) {
    return
  }

  _shareBonus.call(this, player, card)
}

function EndorseAction(this: ActionManager, player: Player, color: string): void {
  this.log.add({
    template: '{player} endorses {color}',
    args: { player, color }
  })
  this.log.indent()

  this.state.didEndorse = true

  const card = this.game.cards.top(player, color)

  // Junk a card
  const featuredBiscuit = card.dogmaBiscuit
  const cities = this
    .game
    .cards.tops(player)
    .filter((card: Card) => card.checkIsCity())
    .filter((card: Card) => card.biscuits.includes(featuredBiscuit))
  const junkChoices = this
    .cards
    .byPlayer(player, 'hand')
    .filter((card: Card) => cities.some((city: Card) => card.getAge() <= city.getAge()))
    .map((card: Card) => card.id)

  this.chooseAndJunk(player, junkChoices, {
    title: 'Junk a card to endorse'
  })

  DogmaHelper.call(this, player, card, { endorsed: true })

  this.log.outdent()
}

interface CardWithAge extends Card {
  getAge(): number
}

function _executeEffects(this: ActionManager, player: Player, card: Card, opts: DogmaOptions): void {
  // Store planned effects now, as changes to the stacks shouldn't affect them.
  let effects: VisibleEffectsResult[] = []

  if (this.game.settings.version < 4) {
    effects = [
      ...this.game.getVisibleEffectsByColor(card.owner, card.color, 'echo'),
      card.visibleEffects('dogma'),
    ].filter((e): e is VisibleEffectsResult => e !== undefined)
  }
  else {
    if (opts.artifact) {
      effects = [card.visibleEffects('dogma')].filter((e): e is VisibleEffectsResult => e !== undefined)
    }
    else {
      effects = [
        ...this.game.getVisibleEffectsByColor(card.owner, card.color, 'echo'),
        card.visibleEffects('dogma'),
      ].filter((e): e is VisibleEffectsResult => e !== undefined)
    }
  }

  for (const e of effects) {
    for (let i = 0; i < e.texts.length; i++) {
      this.game.aOneEffect(player, e.card, e.texts[i], e.impls[i], {
        sharing: this.state.dogmaInfo.sharing,
        demanding: this.state.dogmaInfo.demanding,
        endorsed: opts.endorsed,
        foreseen: opts.foreseen,
      })
      if (this.state.dogmaInfo.earlyTerminate) {
        return
      }
    }
  }
}

function _statsRecordDogmaActions(this: ActionManager, _player: Player, card: Card): void {
  if (card.name in this.game.stats.dogmaActions) {
    this.game.stats.dogmaActions[card.name] += 1
  }
  else {
    this.game.stats.dogmaActions[card.name] = 1
  }
}


function _shareBonus(this: ActionManager, player: Player, card: Card): void {
  // Share bonus
  if (this.state.dogmaInfo.shared) {
    const shareKarmaKind = this.game.aKarma(player, 'share', { card })
    if (shareKarmaKind === 'would-instead') {
      this.acted(player)
      return
    }

    this.log.add({
      template: '{player} draws a sharing bonus',
      args: { player }
    })
    this.log.indent()
    const expansion = this.game.getExpansionList().includes('figs') ? 'figs' : ''
    this.draw(player, {
      exp: expansion,
      share: true,
      featuredBiscuit: this.state.dogmaInfo.featuredBiscuit
    })
    this.log.outdent()
  }

  // Grace Hopper and Susan Blackmore have "if your opponent didn't share" karma effects
  else if (card.checkHasShare()) {
    this.game.aKarma(player, 'no-share', { card })
  }
}

function _getBiscuitComparator(this: ActionManager, player: Player, featuredBiscuit: string, biscuits: Record<string, BiscuitCounts>): (other: Player) => boolean {
  return (other: Player) => {
    if (featuredBiscuit === 'score') {
      return this.game.getScore(other) >= this.game.getScore(player)
    }
    else if (this.state.dogmaInfo.soleMajorityPlayerId === other.id) {
      return true
    }
    else if (this.state.dogmaInfo.soleMajorityPlayerId === player.id) {
      return false
    }
    else {
      return biscuits[other.name][featuredBiscuit as keyof BiscuitCounts] >= biscuits[player.name][featuredBiscuit as keyof BiscuitCounts]
    }
  }
}

function _getDogmaBiscuits(this: ActionManager, player: Player, card: Card, opts: DogmaOptions): Record<string, BiscuitCounts> {
  const biscuits = this.game.getBiscuits()
  const artifactBiscuits = opts.artifact ? card.visibleBiscuitsParsed() : this.util.emptyBiscuits()
  biscuits[player.name] = this.util.combineBiscuits(biscuits[player.name], artifactBiscuits)

  return biscuits
}

function _getSharingAndDemanding(this: ActionManager, player: Player, featuredBiscuit: string, biscuits: Record<string, BiscuitCounts>): { sharing: Player[]; demanding: Player[] } {
  const biscuitComparator = _getBiscuitComparator.call(this, player, featuredBiscuit, biscuits)
  const otherPlayers = this.players.other(player)

  const sharing = otherPlayers.filter((p: Player) => biscuitComparator(p))
  const demanding = otherPlayers.filter((p: Player) => !biscuitComparator(p))

  return { sharing, demanding }
}

function _logSharing(this: ActionManager): void {
  if (this.state.dogmaInfo.sharing.length > 0) {
    this.log.add({
      template: 'Effects will share with {players}.',
      args: { players: this.state.dogmaInfo.sharing },
    })
  }

  if (this.state.dogmaInfo.demanding.length > 0) {
    this.log.add({
      template: 'Demands will be made of {players}.',
      args: { players: this.state.dogmaInfo.demanding },
    })
  }
}

function getDogmaShareInfo(this: { getBiscuits(): Record<string, BiscuitCounts> }, player: Player, card: Card): { sharing: Player[]; demanding: Player[] } {
  return _getSharingAndDemanding.call(this as unknown as ActionManager, player, card.dogmaBiscuit, this.getBiscuits())
}


module.exports = {
  DogmaAction,
  EndorseAction,
  getDogmaShareInfo,
}

export { DogmaAction, EndorseAction, getDogmaShareInfo }
export type { DogmaOptions, DogmaInfo }
