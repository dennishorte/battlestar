/**
 * Type definitions for Innovation card callbacks.
 * These interfaces define the minimal shape needed by card effect functions.
 * The actual implementations in innovation.ts extend these with more specific types.
 *
 * Note: These interfaces use index signatures to allow access to additional
 * properties not explicitly typed. This provides flexibility for cards that
 * use less common game methods while maintaining type safety for core APIs.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any

// Forward declarations for minimal interfaces to avoid circular dependencies
export interface CardEffectCard {
  id: string
  name: string
  age: number
  color: string
  expansion: string
  biscuits: string
  dogmaBiscuit: string
  zone: CardEffectZone
  owner: CardEffectPlayer | null
  checkIsFigure(): boolean
  checkIsCity(): boolean
  checkHasBonus(): boolean
  checkIsArtifact(): boolean
  checkIsEchoes(): boolean
  checkIsStandardAchievement(): boolean
  checkIsExpansion(expansion: string): boolean
  checkHasBiscuit(biscuit: string): boolean
  checkHasDemand(): boolean
  checkBiscuitIsVisible(biscuit: string): boolean
  checkSharesBiscuit(card: CardEffectCard): boolean
  getBonuses(): number[]
  getBiscuitCount(biscuit: string): number
  getAge(): number
  visibleBiscuits(): string
  visibleBiscuitsParsed(): Record<string, number>
  moveTo(zone: CardEffectZone | string, position?: number): CardEffectCard
  reveal(): void
  inHand(): boolean
  isTopCardStrict(): boolean
  isTopCard(): boolean
  isDistinct(cards: CardEffectCard[]): boolean
  home?: CardEffectZone
  // Allow additional properties for less common card methods
  [key: string]: unknown
}

export interface CardEffectZone {
  id: string
  color?: string
  splay?: string
  owner?: CardEffectPlayer
  cardlist(): CardEffectCard[]
  // Allow additional properties
  [key: string]: unknown
}

export interface CardEffectPlayer {
  id: string
  name: string
  // Allow additional properties for player-specific data
  [key: string]: unknown
}

export interface CardEffectLog {
  add(entry: { template: string; classes?: string[]; args?: Record<string, unknown> }): void
  addForeseen(foreseen: boolean, card: CardEffectCard): void
  addNoEffect(): void
  indent(): void
  outdent(): void
  // Allow additional logging methods
  [key: string]: unknown
}

export interface CardEffectActions {
  draw(player: CardEffectPlayer, opts?: Record<string, unknown>): CardEffectCard
  drawAndReveal(player: CardEffectPlayer, age: number, opts?: Record<string, unknown>): CardEffectCard
  drawAndMeld(player: CardEffectPlayer, age: number, opts?: Record<string, unknown>): CardEffectCard
  drawAndTuck(player: CardEffectPlayer, age: number, opts?: Record<string, unknown>): CardEffectCard
  drawAndScore(player: CardEffectPlayer, age: number, opts?: Record<string, unknown>): CardEffectCard
  drawAndForeshadow(player: CardEffectPlayer, age: number, opts?: Record<string, unknown>): CardEffectCard
  meld(player: CardEffectPlayer, card: CardEffectCard, opts?: Record<string, unknown>): CardEffectCard
  score(player: CardEffectPlayer, card: CardEffectCard): CardEffectCard
  scoreMany(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard[]
  tuck(player: CardEffectPlayer, card: CardEffectCard): CardEffectCard
  splay(player: CardEffectPlayer, color: string, direction: string): void
  transfer(player: CardEffectPlayer, card: CardEffectCard, zone: CardEffectZone): void
  return(player: CardEffectPlayer, card: CardEffectCard): void
  returnMany(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard[]
  reveal(player: CardEffectPlayer, card: CardEffectCard): CardEffectCard
  revealMany(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard[]
  safeguard(player: CardEffectPlayer, card: CardEffectCard): CardEffectCard
  junkMany(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard[]
  junkDeck(player: CardEffectPlayer, age: number, opts?: Record<string, unknown>): boolean
  junkAvailableAchievement(player: CardEffectPlayer, name: string): void
  choose(player: CardEffectPlayer, options: unknown[], opts?: Record<string, unknown>): unknown
  chooseCard(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard
  choosePlayer(player: CardEffectPlayer, players: CardEffectPlayer[], opts?: Record<string, unknown>): CardEffectPlayer | undefined
  chooseAge(player: CardEffectPlayer, ages: number[], opts?: Record<string, unknown>): number
  chooseAndTransfer(player: CardEffectPlayer, cards: CardEffectCard[], zone: CardEffectZone, opts?: Record<string, unknown>): CardEffectCard[]
  chooseAndScore(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard[]
  chooseAndMeld(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard[]
  chooseAndTuck(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard[]
  chooseAndReturn(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard[]
  chooseAndSplay(player: CardEffectPlayer, colors: string[], direction: string, opts?: Record<string, unknown>): void
  chooseAndAchieve(player: CardEffectPlayer, achievements: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard[]
  claimAchievement(player: CardEffectPlayer, opts: CardEffectCard | Record<string, unknown>): CardEffectCard | undefined
  acted(player: CardEffectPlayer): void
  unsplay(player: CardEffectPlayer, color: string): void
  chooseYesNo(player: CardEffectPlayer, question: string, opts?: Record<string, unknown>): boolean
  chooseHighest(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard
  chooseLowest(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard
  chooseColor(player: CardEffectPlayer, colors: string[], opts?: Record<string, unknown>): string
  chooseBiscuit(player: CardEffectPlayer, biscuits: string[], opts?: Record<string, unknown>): string
  chooseZone(player: CardEffectPlayer, zones: CardEffectZone[], opts?: Record<string, unknown>): CardEffectZone
  chooseCards(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard[]
  meldMany(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard[]
  tuckMany(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard[]
  transferMany(player: CardEffectPlayer, cards: CardEffectCard[], zone: CardEffectZone, opts?: Record<string, unknown>): CardEffectCard[]
  foreshadow(player: CardEffectPlayer, card: CardEffectCard, opts?: Record<string, unknown>): CardEffectCard
  foreshadowMany(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard[]
  safeguardMany(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard[]
  safeguardAvailableAchievement(player: CardEffectPlayer, name: string): void
  junk(player: CardEffectPlayer, card: CardEffectCard, opts?: Record<string, unknown>): CardEffectCard | undefined
  flipCoin(player: CardEffectPlayer, opts?: Record<string, unknown>): boolean
  drawAndJunk(player: CardEffectPlayer, age: number, opts?: Record<string, unknown>): CardEffectCard
  drawAndSafeguard(player: CardEffectPlayer, age: number, opts?: Record<string, unknown>): CardEffectCard
  chooseAndJunk(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard[]
  chooseAndForeshadow(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard[]
  chooseAndSafeguard(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard[]
  chooseAndReveal(player: CardEffectPlayer, cards: CardEffectCard[], opts?: Record<string, unknown>): CardEffectCard[]
  chooseAndJunkDeck(player: CardEffectPlayer, ages: number[], opts?: Record<string, unknown>): void
  chooseAndUnsplay(player: CardEffectPlayer, colors: string[], opts?: Record<string, unknown>): void
  // Allow additional action methods
  [key: string]: AnyFunction
}

export interface CardEffectUtils {
  colors(): string[]
  highestCards(cards: CardEffectCard[], opts?: { visible?: boolean }): CardEffectCard[]
  lowestCards(cards: CardEffectCard[]): CardEffectCard[]
  emptyBiscuits(): Record<string, number>
  // Allow additional utility methods
  [key: string]: unknown
}

export interface CardEffectGame {
  actions: CardEffectActions
  log: CardEffectLog
  util: CardEffectUtils
  state: Record<string, unknown>
  zones: {
    byPlayer(player: CardEffectPlayer, zone: string): CardEffectZone
    byId(id: string): CardEffectZone
    byDeck(exp: string, age: number): CardEffectZone
    colorStacks(player: CardEffectPlayer): CardEffectZone[]
    [key: string]: unknown
  }
  cards: {
    tops(player: CardEffectPlayer): CardEffectCard[]
    topsAll(): CardEffectCard[]
    top(player: CardEffectPlayer, color: string): CardEffectCard | undefined
    bottom(player: CardEffectPlayer, color: string): CardEffectCard | undefined
    bottoms(player: CardEffectPlayer): CardEffectCard[]
    fullBoard(player: CardEffectPlayer): CardEffectCard[]
    byPlayer(player: CardEffectPlayer, zone: string): CardEffectCard[]
    byZone(zone: string): CardEffectCard[]
    byDeck(exp: string, age: number): CardEffectCard[]
    byId(id: string): CardEffectCard
    [key: string]: unknown
  }
  players: {
    all(): CardEffectPlayer[]
    current(): CardEffectPlayer
    opponents(player: CardEffectPlayer): CardEffectPlayer[]
    other(player: CardEffectPlayer): CardEffectPlayer[]
    startingWith(player: CardEffectPlayer): CardEffectPlayer[]
    [key: string]: unknown
  }
  getEffectAge(card: CardEffectCard, age: number): number
  getAges(): number[]
  getBonuses(player: CardEffectPlayer): number[]
  getScore(player: CardEffectPlayer): number
  getAvailableStandardAchievements(player: CardEffectPlayer): CardEffectCard[]
  checkAchievementAvailable(name: string): boolean
  checkAchievementEligibility(player: CardEffectPlayer, card: CardEffectCard, opts?: Record<string, unknown>): boolean
  aSelfExecute(executingCard: CardEffectCard, player: CardEffectPlayer, card: CardEffectCard, opts?: Record<string, unknown>): void
  youWin(player: CardEffectPlayer, reason: string): void
  // Allow additional game methods
  [key: string]: unknown
}

/**
 * Context object passed to dogma effect functions.
 * The `self` property is always the card whose effect is being executed.
 */
export interface DogmaContext {
  self: CardEffectCard
  leader?: CardEffectPlayer
  foreseen?: boolean
}

/**
 * Context object passed to karma effect functions.
 * Different karma triggers receive different context properties.
 */
export interface KarmaContext {
  self?: CardEffectCard
  card?: CardEffectCard
  owner?: CardEffectPlayer
  direction?: string
  color?: string
  event?: unknown
  leader?: CardEffectPlayer
}

/**
 * Dogma effect function type.
 * Called when a card's dogma or echo effect is executed.
 */
export type DogmaFunction = (
  game: CardEffectGame,
  player: CardEffectPlayer,
  context: DogmaContext
) => void

/**
 * Karma implementation interface.
 * Karmas are triggered effects that can modify or replace other game actions.
 */
export interface KarmaImpl {
  trigger: string | string[]
  kind?: string
  decree?: string
  reason?: string
  triggerAll?: boolean
  matches?: (game: CardEffectGame, player: CardEffectPlayer, context: KarmaContext) => boolean
  func?: (game: CardEffectGame, player: CardEffectPlayer, context: KarmaContext) => unknown
}

/**
 * Card data interface for age cards (standard cards, echoes, figures, cities, artifacts).
 * Use with `satisfies AgeCardData` when defining card exports.
 */
export interface AgeCardData {
  id?: string
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
  // Achievement-specific fields
  shortName?: string
  text?: string
  alt?: string
  isSpecialAchievement?: boolean
  isDecree?: boolean
  isMuseum?: boolean
  checkPlayerIsEligible?: (
    game: CardEffectGame,
    player: CardEffectPlayer,
    reduceCost: boolean
  ) => boolean
  decreeImpl?: (game: CardEffectGame, player: CardEffectPlayer) => void
}
