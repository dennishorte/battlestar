const { BaseActionManager } = require('../lib/game/index.js')

const { DogmaAction, EndorseAction } = require('./actions/Dogma.js')
const { DrawAction } = require('./actions/Draw.js')
const { MeldAction } = require('./actions/Meld.js')

const util = require('../lib/util.js')

import type { UltimatePlayer, BiscuitCounts } from './UltimatePlayer.js'
import type { DogmaInfo } from './actions/Dogma.js'

interface Card {
  id: string
  name: string
  age: number
  color: string
  expansion: string
  zone: Zone
  owner: UltimatePlayer | null
  isSpecialAchievement?: boolean
  isDecree?: boolean
  isMuseum?: boolean
  visibility: UltimatePlayer[]
  visible(player: UltimatePlayer): boolean
  moveTo(zone: Zone, position?: number): Card
  moveHome(): void
  reveal(): void
  getAge(): number
  getHiddenName(game: Game): string
  checkHasBiscuit(biscuit: string): boolean
  checkIsCity(): boolean
}

interface Zone {
  id: string
  splay: string
  cardlist(): Card[]
  peek(): Card | null
  isArtifactZone(): boolean
  isMuseumZone(): boolean
}

interface UltimateUtils {
  colors(): string[]
  biscuitNames(): string[]
  biscuitNameToIcon(name: string): string
  highestCards(cards: Card[]): Card[]
  lowestCards(cards: Card[]): Card[]
  emptyBiscuits(): BiscuitCounts
  combineBiscuits(left: BiscuitCounts, right: BiscuitCounts): BiscuitCounts
}

interface ZoneManager {
  byId(id: string): Zone
  byDeck(exp: string, age: number): Zone
  byPlayer(player: UltimatePlayer, zone: string): Zone
  colorStacks(player: UltimatePlayer): Zone[]
}

interface CardManager {
  byId(id: string): Card
  byZone(zone: string): Card[]
  byPlayer(player: UltimatePlayer, zone: string): Card[]
  byDeck(exp: string, age: number): Card[]
  tops(player: UltimatePlayer): Card[]
  top(player: UltimatePlayer, color: string): Card | undefined
}

interface PlayerManager {
  all(): UltimatePlayer[]
  other(player: UltimatePlayer): UltimatePlayer[]
  current(): UltimatePlayer
  opponents(player: UltimatePlayer): UltimatePlayer[]
  startingWith(player: UltimatePlayer): UltimatePlayer[]
}

interface Log {
  add(entry: { template: string; args?: Record<string, unknown> }): void
  addNoEffect(): void
  addDoNothing(player: UltimatePlayer): void
  indent(): void
  outdent(): void
}

interface KarmaInfo {
  card: Card
  impl: {
    func: (game: Game, player: UltimatePlayer) => unknown
  }
}

interface GameState {
  initializationComplete: boolean
  firstPicksComplete: boolean
  dogmaInfo: DogmaInfo
  wouldWinKarma?: boolean
  scoreCount: Record<string, number>
  tuckCount: Record<string, number>
  tuckedGreenForPele: UltimatePlayer[]
  didEndorse?: boolean
}

interface Game {
  util: UltimateUtils
  zones: ZoneManager
  cards: CardManager
  players: PlayerManager
  state: GameState
  settings: { version: number }
  actions: UltimateActionManager
  log: Log
  getExpansionList(): string[]
  getAges(): number[]
  getMinAge(): number
  getMaxAge(): number
  getScore(player: UltimatePlayer, opts?: Record<string, unknown>): number
  getScoreCost(player: UltimatePlayer, card: Card): number
  getHighestTopAge(player: UltimatePlayer, opts?: { reason?: string }): number
  getNumAchievementsToWin(): number
  getAchievementsByPlayer(player: UltimatePlayer): { total: number }
  getAvailableAchievementsByAge(player: UltimatePlayer, age: number): Card[]
  getAvailableMuseums(): Card[]
  getForecastLimit(player: UltimatePlayer): number
  getSafeLimit(player: UltimatePlayer): number
  checkAchievementEligibility(player: UltimatePlayer, card: Card, opts?: Record<string, unknown>): boolean
  checkSameTeam(player1: UltimatePlayer, player2: UltimatePlayer): boolean
  getInfoByKarmaTrigger(player: UltimatePlayer, trigger: string): KarmaInfo[]
  aKarma(player: UltimatePlayer, trigger: string, opts?: Record<string, unknown>): string | undefined
  youWin(player: UltimatePlayer, reason: string): void
}

interface AchieveOptions {
  expansion?: string
  age?: number
  isStandard?: boolean
  nonAction?: boolean
  [key: string]: unknown
}

interface ClaimOptions {
  card?: Card
  name?: string
  age?: number
  expansion?: string
  isStandard?: boolean
}

interface ChooseOptions {
  min?: number
  max?: number
  count?: number
  title?: string
  hidden?: boolean
  visible?: boolean
  guard?: (cards: Card[]) => boolean
  reveal?: boolean
  ordered?: boolean
  optional?: boolean
}

interface DrawOptions {
  age?: number
  exp?: string
  silent?: boolean
}

interface SplayOptions {
  owner?: UltimatePlayer
}

interface TransferTarget {
  toBoard?: boolean
  player?: UltimatePlayer
}

type ActionFunction = (player: UltimatePlayer, card: Card, opts?: Record<string, unknown>) => Card | undefined

class UltimateActionManager extends BaseActionManager {
  game!: Game
  state!: GameState
  zones!: ZoneManager
  cards!: CardManager
  players!: PlayerManager
  log!: Log
  util!: UltimateUtils
  actions!: UltimateActionManager

  constructor(game: Game) {
    super(game)
  }

  // Some actions are very complex, and so are separated into their own files
  dogma = DogmaAction
  draw = DrawAction
  endorse = EndorseAction
  meld = MeldAction

  /**
     Validates that a player can claim a specific achievement.
     Throws an Error if the player is not eligible.
   */
  _validateAchievementClaim(player: UltimatePlayer, card: Card | undefined, opts: AchieveOptions = {}): void {
    if (!card) {
      throw new Error('Achievement not found')
    }

    // Special achievements have their own eligibility check
    if (card.isSpecialAchievement) {
      if (card.zone.id !== 'achievements') {
        throw new Error(`${card.name} has already been claimed`)
      }
      if ((card as Card & { checkPlayerIsEligible?: (game: Game, player: UltimatePlayer, reduceCost: boolean) => boolean }).checkPlayerIsEligible) {
        const reduceCost = this.game.getInfoByKarmaTrigger(
          player,
          'reduce-special-achievement-requirements'
        ).length > 0
        if (!(card as Card & { checkPlayerIsEligible: (game: Game, player: UltimatePlayer, reduceCost: boolean) => boolean }).checkPlayerIsEligible(this.game, player, reduceCost)) {
          throw new Error(`Player is not eligible for ${card.name}`)
        }
      }
      return
    }

    // Standard achievements check age and score requirements
    if (!this.game.checkAchievementEligibility(player, card, opts)) {
      const topCardAge = this.game.getHighestTopAge(player, { reason: 'achieve' })
      const scoreCost = this.game.getScoreCost(player, card)
      const currentScore = this.game.getScore(player, opts)

      const issues: string[] = []
      if (card.getAge() > topCardAge) {
        issues.push(`age requirement (need age ${card.getAge()}, have ${topCardAge})`)
      }
      if (scoreCost > currentScore) {
        issues.push(`score requirement (need ${scoreCost}, have ${currentScore})`)
      }

      throw new Error(`Not eligible for ${card.name}: ${issues.join(', ')}`)
    }
  }

  /**
     This is the Achieve Action, not just claiming an achievemenet as part of a dogma action.
   */
  achieveAction(player: UltimatePlayer, arg: string, opts: AchieveOptions = {}): void {
    const _parseHiddenCardName = function(name: string): { expansion: string; age: number } {
      return {
        expansion: name.substr(1, 4),
        age: parseInt(name.substr(6)),
      }
    }

    let card: Card | undefined
    const claimOpts: AchieveOptions = { ...opts }

    if (arg.startsWith('safe: ')) {
      const hiddenName = arg.substr(6)
      const { expansion, age } = _parseHiddenCardName(hiddenName)
      card = this
        .cards
        .byPlayer(player, 'safe')
        .find((c: Card) => c.expansion === expansion && c.getAge() === age)
    }
    else if (arg.startsWith('*')) {
      const { expansion, age } = _parseHiddenCardName(arg)
      claimOpts.expansion = expansion
      claimOpts.age = age
      claimOpts.isStandard = opts.nonAction ? false : true
      card = this
        .game
        .cards
        .byZone('achievements')
        .filter((card: Card) => !card.isSpecialAchievement && !card.isDecree)
        .find((c: Card) => c.getAge() === age && c.expansion === expansion)
    }
    else {
      card = this.cards.byId(arg)
    }

    // Validate eligibility before claiming
    this._validateAchievementClaim(player, card, claimOpts)

    // Claim the achievement
    if (arg.startsWith('safe: ')) {
      this.actions.claimAchievement(player, { card })
    }
    else if (arg.startsWith('*')) {
      this.actions.claimAchievement(player, { expansion: claimOpts.expansion, age: claimOpts.age, isStandard: claimOpts.isStandard })
    }
    else {
      this.actions.claimAchievement(player, { card })
    }
  }

  acted(player: UltimatePlayer): void {
    if (!this.state.initializationComplete || !this.state.firstPicksComplete) {
      return
    }

    if (
      !this.state.dogmaInfo.isDemandEffect
      && this.state.dogmaInfo.acting
      && this.state.dogmaInfo.acting.name === player.name
      && !this.game.checkSameTeam(player, this.players.current())
    ) {
      this.state.dogmaInfo.shared = true
    }

    // Special handling for "The Big Bang"
    this.state.dogmaInfo.theBigBangChange = true

    ////////////////////////////////////////////////////////////
    // Color zones that have only one or fewer cards become unsplayed

    for (const p of this.players.all()) {
      for (const color of this.game.util.colors()) {
        const zone = this.zones.byPlayer(p, color)
        if (zone.cardlist().length < 2) {
          zone.splay = 'none'
        }
      }
    }

    ////////////////////////////////////////////////////////////
    // Check if any player has won

    // Some karmas create special handling for win conditions
    if (!this.state.wouldWinKarma) {
      for (const p of this.players.all()) {
        if (this.game.getAchievementsByPlayer(p).total >= this.game.getNumAchievementsToWin()) {
          this.game.youWin(p, 'achievements')
        }
      }
    }
  }

  auspice(player: UltimatePlayer, card: Card): void {
    this.log.add({
      template: '{player} uses auspice on {card}',
      args: { player, card }
    })
    this.dogma(player, card, { auspice: true })
  }

  choose(player: UltimatePlayer, choices: unknown[], opts: ChooseOptions = {}): unknown[] {
    if (this.state.dogmaInfo.mayIsMust) {
      opts.min = Math.max(1, opts.min || 1)
    }

    return super.choose(player, choices, opts)
  }

  chooseYesNo(player: UltimatePlayer, title: string): boolean {
    if (this.game.state.dogmaInfo.mayIsMust) {
      this.game.log.add({
        template: '{player} is being blackmailed, so must choose yes',
        args: { player }
      })
      return true
    }
    else {
      return super.chooseYesNo(player, title)
    }
  }

  chooseAge(player: UltimatePlayer, ages?: number[], opts: ChooseOptions = {}): number | undefined {
    if (!ages) {
      ages = this.game.getAges()
    }
    else {
      ages = [...ages]
    }

    const selected = this.choose(player, ages, { min: 1, max: 1, ...opts, title: 'Choose Age' }) as number[]
    if (selected) {
      return selected[0]
    }
  }

  chooseAndAchieve(player: UltimatePlayer, choices: Card[], opts: ChooseOptions = {}): Card[] {
    if (choices.length === 0) {
      this.log.add({
        template: 'There are no valid achievements to claim'
      })
    }

    // TODO: This doesn't properly hide the achievements in some cases, but it's complicated,
    //       so I'm punting for now.
    const selected = this.actions.chooseCards(
      player,
      choices,
      { ...opts, title: 'Choose Achievement' }
    )

    for (const card of selected) {
      this.claimAchievement(player, { card })
    }

    return selected
  }

  chooseAndJunkDeck(player: UltimatePlayer, ages: number[], opts: ChooseOptions = {}): boolean {
    const age = this.chooseAge(player, ages, {
      title: 'Choose a deck to junk',
      ...opts
    })

    if (age) {
      return this.actions.junkDeck(player, age)
    }
    else {
      return false
    }
  }

  chooseAndSplay(player: UltimatePlayer, choices: string[] | undefined, direction: string, opts: ChooseOptions = {}): string[] {
    util.assert(direction, 'No direction specified for splay')

    if (!choices) {
      choices = this.util.colors()
    }

    choices = choices
      .filter((color: string) => this.zones.byPlayer(player, color).splay !== direction)
      .filter((color: string) => this.zones.byPlayer(player, color).cardlist().length > 1)

    if (choices.length === 0) {
      this.log.addNoEffect()
      return []
    }

    // Splaying is almost always optional
    if (!opts.count && !opts.min && !opts.max) {
      opts.min = 0
      opts.max = 1
    }

    const colors = this.choose(
      player,
      choices,
      { ...opts, title: `Choose a color to splay ${direction}` }
    ) as string[]
    if (colors.length === 0) {
      this.log.addDoNothing(player)
      return []
    }
    else {
      const splayed: string[] = []
      for (const color of colors) {
        const result = this.actions.splay(player, color, direction)
        if (result) {
          splayed.push(result)
        }
      }
      return splayed
    }
  }

  chooseAndUnsplay(player: UltimatePlayer, choices: string[], opts: ChooseOptions = {}): void {
    const colors = this.choose(player, choices, {
      title: 'Choose a color',
      ...opts
    }) as string[]
    for (const color of colors) {
      this.unsplay(player, color)
    }
  }

  chooseByPredicate(player: UltimatePlayer, cards: Card[], count: number, pred: (cards: Card[]) => Card[], opts: ChooseOptions = {}): Card[] {
    let numRemaining = count
    let cardsRemaining = [...cards]
    let selected: Card[] = []

    while (numRemaining > 0 && cardsRemaining.length > 0) {
      const choices = pred(cardsRemaining)
      cardsRemaining = cardsRemaining.filter((card: Card) => !choices.includes(card))

      if (choices.length <= numRemaining) {
        selected = selected.concat(choices)
        numRemaining -= choices.length
      }
      else {
        const chosen = this.chooseCards(player, choices, { count: numRemaining, ...opts })
        selected = selected.concat(chosen)
        numRemaining -= chosen.length
      }
    }

    return selected
  }

  chooseHighest(player: UltimatePlayer, cards: Card[], count: number): Card[] {
    return this.chooseByPredicate(player, cards, count, this.util.highestCards)
  }

  chooseLowest(player: UltimatePlayer, cards: Card[], count: number): Card[] {
    return this.chooseByPredicate(player, cards, count, this.util.lowestCards)
  }

  chooseBiscuit(player: UltimatePlayer): string {
    const biscuitName = (this.actions.choose(player, this.util.biscuitNames()) as string[])[0]
    return this.util.biscuitNameToIcon(biscuitName)
  }

  chooseCards(player: UltimatePlayer, cards: (Card | string)[], opts: ChooseOptions = {}): Card[] {
    if (cards.length === 0 || opts.count === 0 || opts.max === 0) {
      this.log.addNoEffect()
      return []
    }

    const choiceMap = cards.map((card: Card | string) => {
      if (card === 'auto') {
        // 'auto' is a special keyword used createManyMethod that allows players
        // to skip manually ordering the actions on many cards.
        return { name: 'auto', card: 'auto' as const }
      }
      else if (typeof card === 'string' || !(card as Card).id) {
        card = this.cards.byId(card as string)
      }

      const typedCard = card as Card
      let cardIsHidden = opts.hidden || !typedCard.visible(player)
      if (opts.visible) {
        cardIsHidden = false
      }


      if (cardIsHidden) {
        return { name: typedCard.getHiddenName(this.game), card: typedCard }
      }
      else {
        return { name: typedCard.id, card: typedCard }
      }
    })

    opts.title = opts.title || 'Choose Cards(s)'
    const choices = choiceMap.map((x: { name: string }) => x.name)

    if (opts.hidden) {
      choices.sort()
    }

    let output: Card[]

    while (true) {
      const cardNames = this.choose(
        player,
        choices,
        opts
      ) as string[]

      if (cardNames.length === 0) {
        this.log.addDoNothing(player)
        return []
      }

      if (cardNames.includes('auto')) {
        return ['auto'] as unknown as Card[]
      }
      else {
        output = []

        for (const name of cardNames) {
          const mapping = choiceMap.find((m: { name: string; card: Card | 'auto' }) => m.name === name && !output.includes(m.card as Card))
          output.push(mapping!.card as Card)
        }
      }

      if (opts.guard && !opts.guard(output)) {
        this.log.add({ template: 'invalid selection' })
        continue
      }
      else {
        break
      }
    }

    return output
  }

  chooseCard(player: UltimatePlayer, cards: (Card | string)[], opts: ChooseOptions = {}): Card | undefined {
    const result = this.chooseCards(player, cards, { min: 1, max: 1, ...opts })
    return result[0]
  }

  chooseColor(player: UltimatePlayer, choices?: string[]): string {
    if (!choices) {
      choices = this.util.colors()
    }
    return (this.choose(player, choices, { title: 'Choose a color' }) as string[])[0]
  }

  chooseZone(player: UltimatePlayer, zones: Zone[]): Zone | undefined {
    if (zones.length === 0) {
      return undefined
    }

    const zoneIds = zones.map((zone: Zone) => zone.id)
    const selectedId = (this.game.actions.choose(player, zoneIds, {
      title: 'Choose a zone',
    }) as string[])[0]

    return this.game.zones.byId(selectedId)
  }

  claimAchievement(player: UltimatePlayer, opts: ClaimOptions = {}): Card | undefined {
    // Identify the card to be achieved
    const card = (function(this: UltimateActionManager): Card | undefined {
      // ...Sometimes, a card is passed directly
      if (opts.card) {
        return opts.card
      }

      // ...Sometimes, we get a specific card, by name
      else if (opts.name) {
        return this.cards.byId(opts.name)
      }

      // ...Sometimes, the player is just getting a standard achievement, by age and expansion
      else if (opts.age) {
        return this
          .game
          .cards
          .byZone('achievements')
          .filter((card: Card) => !card.isSpecialAchievement && !card.isDecree)
          .find((c: Card) => c.getAge() === opts.age && c.expansion === opts.expansion)
      }

      else {
        return undefined
      }
    }).call(this)

    if (!card) {
      throw new Error(`Unable to find achievement given opts: ${JSON.stringify(opts)}`)
    }

    // Special achievements can only be claimed from the achievements zone
    if (card.isSpecialAchievement && card.zone.id !== 'achievements') {
      this.log.add({
        template: `{card} has already been claimed`,
        args: { card }
      })
      return
    }

    // Handle karma
    const karmaKind = this.game.aKarma(player, 'achieve', { ...opts, card })
    if (karmaKind === 'would-instead') {
      this.acted(player)
      return
    }

    // Do the actual achievement claiming
    const source = card.zone
    card.moveTo(this.zones.byPlayer(player, 'achievements'))

    this.log.add({
      template: '{player} achieves {card} from {zone}',
      args: { player, card, zone: source }
    })

    this.acted(player)

    // Draw figures if the player claimed a standard achievement
    if (opts.isStandard && this.game.getExpansionList().includes('figs')) {
      const others = this
        .players
        .startingWith(player)
        .filter((other: UltimatePlayer) => !this.game.checkSameTeam(player, other))

      for (const opp of others) {
        this.draw(opp, { exp: 'figs' })
      }
    }

    return card
  }

  digArtifact(player: UltimatePlayer, age: number): void {
    const choices: (string | { title: string; choices: string[]; min: number })[] = []

    // Dig options
    if (this.cards.byPlayer(player, 'artifact').length > 0) {
      this.log.add({
        template: '{player} already has an artifact on display',
        args: { player }
      })
    }
    else if (this.cards.byDeck('arti', age).length === 0) {
      this.log.add({
        template: `Artifacts deck for age ${age} is empty.`
      })
    }
    else {
      choices.push('dig')
    }

    // Seize options
    const canSeize = this
      .players
      .other(player)
      .flatMap((p: UltimatePlayer) => this.cards.byPlayer(p, 'museum'))
      .filter((card: Card) => !card.isMuseum)
      .filter((card: Card) => card.getAge() === age)

    if (canSeize.length > 0) {
      choices.push({
        title: 'seize',
        choices: canSeize.map((c: Card) => c.id),
        min: 0
      })
    }

    if (choices.length === 0) {
      return
    }

    const chosen = (this.choose(player, choices, {
      title: 'Choose artifact option'
    }) as (string | { title: string; selection: string[] })[])[0]

    if (chosen === 'dig') {
      const card = this.actions.draw(player, { age, exp: 'arti' })
      if (card) {
        this.log.add({
          template: '{player} digs {card}',
          args: { player, card },
        })
        card.moveTo(this.zones.byPlayer(player, 'artifact'))
        this.acted(player)
      }
    }
    else if (typeof chosen === 'object' && chosen.title === 'seize') {
      const cardName = chosen.selection[0]
      const card = this.cards.byId(cardName)
      const museum = card.zone.cardlist().find((card: Card) => card.isMuseum)!
      const originalOwner = card.owner
      const playerMuseumZone = this.zones.byPlayer(player, 'museum')
      card.moveTo(playerMuseumZone)
      museum.moveTo(playerMuseumZone)

      this.log.add({
        template: '{player} seizes {card} from {player2}',
        args: {
          player,
          card,
          player2: originalOwner
        }
      })
      this.acted(player)
    }
    else {
      throw new Error(`Unknown artifact action: ${chosen} (${typeof chosen === 'object' ? chosen.title : ''})`)
    }
  }

  foreshadow = UltimateActionManager.insteadKarmaWrapper('foreshadow', function(this: UltimateActionManager, player: UltimatePlayer, card: Card): Card | undefined {
    const zoneLimit = this.game.getForecastLimit(player)
    const target = this.zones.byPlayer(player, 'forecast')

    if (target.cardlist().length >= zoneLimit) {
      this.log.add({
        template: '{player} has reached the limit for their forecast',
        args: { player },
      })
      return
    }
    else {
      card.moveTo(target)

      this.log.add({
        template: '{player} foreshadows {card} from {zone}',
        args: { player, card, zone: card.zone }
      })

      this.acted(player)
      return card
    }
  })

  junk = UltimateActionManager.insteadKarmaWrapper('junk', function(this: UltimateActionManager, player: UltimatePlayer, card: Card): Card | undefined {
    this.log.add({
      template: '{player} junks {card}',
      args: { player, card }
    })

    const junkedCard = card.moveTo(this.zones.byId('junk'))

    // Only mark this player as having acted if something actually changed
    if (junkedCard) {
      this.acted(player)
    }

    // Check if any of the city junk achievements are triggered
    if (card.checkHasBiscuit(';')) {
      this.claimAchievement(player, { name: 'Glory' })
    }

    if (card.checkHasBiscuit(':')) {
      this.claimAchievement(player, { name: 'Victory' })
    }

    return junkedCard
  })

  junkAvailableAchievement(player: UltimatePlayer, ages: number | number[], opts: ChooseOptions = {}): Card | undefined {
    if (!Array.isArray(ages)) {
      ages = [ages]
    }

    const eligible = ages.flatMap((age: number) => this.game.getAvailableAchievementsByAge(player, age))

    const card = this.chooseCards(player, eligible, {
      title: 'Choose an achievement to junk',
      hidden: true,
      ...opts
    })[0]

    if (card) {
      return this.junk(player, card)
    }
  }

  junkDeck(player: UltimatePlayer, age: number, opts: { exp?: string; optional?: boolean } = {}): boolean {
    if (age < this.game.getMinAge() || age > this.game.getMaxAge()) {
      this.game.log.add({
        template: 'No deck of age {age}',
        args: { age }
      })
      return false
    }

    const exp = opts.exp || 'base'
    const cards = this.cards.byDeck(exp, age)
    if (cards.length === 0) {
      this.log.add({
        template: 'The {age} deck is already empty.',
        args: { age },
      })
      return false
    }

    let doJunk = true
    if (opts.optional) {
      doJunk = this.chooseYesNo(player, `Junk the ${age} deck?`)
    }

    if (doJunk) {
      this.log.add({
        template: '{player} moves all cards in {exp} {age} deck to the junk',
        args: { player, age, exp }
      })

      this.junkMany(player, cards, { ordered: true })
      return true
    }
    else {
      this.log.add({
        template: '{player} chooses not to junk the {age} deck',
        args: { player, age }
      })
      return false
    }
  }

  return = UltimateActionManager.insteadKarmaWrapper('return', function(this: UltimateActionManager, player: UltimatePlayer, card: Card, opts: { silent?: boolean } = {}): Card {
    if (!opts.silent) {
      this.log.add({
        template: '{player} returns {card}',
        args: { player, card }
      })
    }

    card.moveHome()
    this.acted(player)
    return card
  })

  reveal = UltimateActionManager.insteadKarmaWrapper('reveal', function(this: UltimateActionManager, player: UltimatePlayer, card: Card): Card {
    card.reveal()
    this.log.add({
      template: '{player} reveals {card}',
      args: { player, card }
    })
    this.acted(player)
    return card
  })

  rotate(player: UltimatePlayer, card: Card): void {
    // Only rotate cards if they are in the artifact zone.
    if (!card.zone.isArtifactZone()) {
      this.log.add({
        template: '{card} is not in the artifact zone, so cannot be rotated',
        args: { card },
      })
      return
    }

    // Get a museum
    const museum = this.game.getAvailableMuseums().sort((l: Card, r: Card) => l.name.localeCompare(r.name))[0]

    // If there are no museums, rotate the card into the player's hand
    if (!museum) {
      this.log.add({
        template: 'There are no available museums. {card} rotates to the hand of {player}.',
        args: { card, player }
      })
      card.moveTo(this.zones.byPlayer(player, 'hand'))
      return
    }

    // Otherwise, move the museum into the player's zone and place the card onto it
    this.log.add({
      template: '{card} rotates into a musuem',
      args: { card }
    })
    museum.moveTo(this.zones.byPlayer(player, 'museum'))
    card.moveTo(this.zones.byPlayer(player, 'museum'))

    // If there are no more available museums, do a museum check
    if (this.game.getAvailableMuseums().length === 0) {
      this.log.add({
        template: 'There are no available museums; doing a museum check.'
      })

      // The single player with the most museums claims one
      const museumCounts = this
        .players
        .all()
        .map((p: UltimatePlayer) => ({
          player: p,
          count: this.cards.byPlayer(p, 'museum').length / 2,
        }))
        .sort((l: { count: number }, r: { count: number }) => r.count - l.count)

      if (museumCounts[0].count > museumCounts[1].count) {
        const playerWithTheMost = museumCounts[0].player
        this.log.add({
          template: '{player} has the most museums',
          args: { player: playerWithTheMost }
        })
        const museumToClaim = this.cards.byPlayer(playerWithTheMost, 'museum').find((card: Card) => card.isMuseum)
        this.claimAchievement(playerWithTheMost, { card: museumToClaim })

        // If so, return all cards on museums and all other museum cards
        const cardsToReturn = this
          .players
          .all()
          .flatMap((p: UltimatePlayer) => this.cards.byPlayer(p, 'museum'))

        const museumsToReturn = cardsToReturn.filter((card: Card) => card.isMuseum)
        const othersToReturn = cardsToReturn.filter((card: Card) => !card.isMuseum)

        this.actions.returnMany(player, museumsToReturn, { ordered: true })
        this.actions.returnMany(player, othersToReturn)
      }
    }
  }

  safeguard = UltimateActionManager.insteadKarmaWrapper('safeguard', function(this: UltimateActionManager, player: UltimatePlayer, card: Card): Card | undefined {
    const safeLimit = this.game.getSafeLimit(player)
    const safeZone = this.zones.byPlayer(player, 'safe')

    if (safeZone.cardlist().length >= safeLimit) {
      this.log.add({
        template: '{player} has reached their safe limit',
        args: { player }
      })
      return
    }

    this.log.add({
      template: '{player} safeguards {card} from {zone}',
      args: { player, card, zone: card.zone },
    })

    const moved = card.moveTo(safeZone)

    if (moved) {
      this.acted(player)
    }

    return card
  })

  safeguardAvailableAchievement(player: UltimatePlayer, age: number): void {
    const availableAchievements = this.game.getAvailableAchievementsByAge(player, age)

    if (availableAchievements.length === 0) {
      this.log.add({ template: 'No available achievements of age ' + age })
    }
    else {
      this.safeguard(player, availableAchievements[0])
    }
  }

  score = UltimateActionManager.insteadKarmaWrapper('score', function(this: UltimateActionManager, player: UltimatePlayer, card: Card): Card {
    const target = this.zones.byPlayer(player, 'score')
    card.moveTo(target)
    this.log.add({
      template: '{player} scores {card}',
      args: { player, card }
    })
    this.state.scoreCount[player.name] += 1
    this.acted(player)
    return card
  })

  splay(player: UltimatePlayer, color: string, direction: string, opts: SplayOptions = {}): string | undefined {
    util.assert(direction, 'No direction specified for splay')

    const owner = opts.owner || player

    const zone = this.zones.byPlayer(owner, color)
    if (zone.cardlist().length < 2) {
      this.log.add({
        template: `Cannot splay ${color} ${direction}`
      })
      return
    }

    // A color cannot be replayed in the same direction it is already splayed
    if (zone.splay === direction) {
      this.log.add({
        template: `{zone} is already splayed ${direction}`,
        args: { zone }
      })
      return
    }

    // Karmas don't trigger if someone else is splaying your cards.
    if (owner.name === player.name) {
      const karmaKind = this.game.aKarma(player, 'splay', { ...opts, color, direction })
      if (karmaKind === 'would-instead') {
        this.acted(player)
        return
      }
    }

    // Perform the actual splay
    if (zone.splay !== direction) {
      zone.splay = direction

      if (player.name === owner.name) {
        this.log.add({
          template: '{player} splays {color} {direction}',
          args: { player, color, direction }
        })
      }

      else {
        this.log.add({
          template: "{player} splays {player2}'s {color} {direction}",
          args: { player, player2: owner, color, direction }
        })
      }

      this.acted(player)
    }

    this._maybeDrawCity(owner)

    return color
  }

  /**
     In addition to a zone, target can be a dict with the following format:
     {
       toBoard: true,
       player: PlayerObject
     }
   */
  transfer(player: UltimatePlayer, card: Card, target: Zone | TransferTarget, opts: Record<string, unknown> = {}): Card | undefined {
    if ((target as TransferTarget).toBoard) {
      target = this.zones.byPlayer((target as TransferTarget).player!, card.color)
    }

    // TODO: Figure out how to make insteadKarmaWrapper work with this
    const karmaKind = this.game.aKarma(player, 'transfer', { ...opts, card, target })
    if (karmaKind === 'would-instead') {
      this.acted(player)
      return
    }

    card.moveTo(target as Zone, 0)
    this.log.add({
      template: '{player} transfers {card} to {zone}',
      args: { player, card, zone: target }
    })
    this.acted(player)
    return card
  }

  tuck = UltimateActionManager.insteadKarmaWrapper('tuck', function(this: UltimateActionManager, player: UltimatePlayer, card: Card): Card {
    const target = this.zones.byPlayer(player, card.color)
    card.moveTo(target)
    this.log.add({
      template: '{player} tucks {card}',
      args: { player, card }
    })
    this.state.tuckCount[player.name] += 1
    if (card.color === 'green') {
      util.array.pushUnique(this.state.tuckedGreenForPele, player)
    }
    this.acted(player)

    return card
  })

  unsplay(player: UltimatePlayer, colorOrZone: string | Zone): string | Zone | undefined {
    const zone = typeof colorOrZone === 'string' ? this.zones.byPlayer(player, colorOrZone) : colorOrZone

    if (zone.splay === 'none') {
      this.log.add({
        template: '{zone} is already unsplayed',
        args: { zone }
      })
    }
    else {
      this.log.add({
        template: '{player} unsplays {zone}',
        args: { player, zone }
      })
      zone.splay = 'none'
      return colorOrZone
    }
  }

  foreshadowMany = UltimateActionManager.createManyMethod('foreshadow', 2)
  junkMany = UltimateActionManager.createManyMethod('junk', 2)
  meldMany = UltimateActionManager.createManyMethod('meld', 2)
  revealMany = UltimateActionManager.createManyMethod('reveal', 2)
  returnMany = UltimateActionManager.createManyMethod('return', 2)
  safeguardMany = UltimateActionManager.createManyMethod('safeguard', 2)
  scoreMany = UltimateActionManager.createManyMethod('score', 2)
  transferMany = UltimateActionManager.createManyMethod('transfer', 3)
  tuckMany = UltimateActionManager.createManyMethod('tuck', 2)

  chooseAndForeshadow = UltimateActionManager.createChooseAndMethod('foreshadowMany', 2)
  chooseAndJunk = UltimateActionManager.createChooseAndMethod('junkMany', 2)
  chooseAndMeld = UltimateActionManager.createChooseAndMethod('meldMany', 2)
  chooseAndReveal = UltimateActionManager.createChooseAndMethod('revealMany', 2)
  chooseAndReturn = UltimateActionManager.createChooseAndMethod('returnMany', 2)
  chooseAndSafeguard = UltimateActionManager.createChooseAndMethod('safeguardMany', 2)
  chooseAndScore = UltimateActionManager.createChooseAndMethod('scoreMany', 2)
  chooseAndTransfer = UltimateActionManager.createChooseAndMethod('transferMany', 3)
  chooseAndTuck = UltimateActionManager.createChooseAndMethod('tuckMany', 2)

  drawAndForeshadow = UltimateActionManager.createDrawAndMethod('foreshadow', 2)
  drawAndJunk = UltimateActionManager.createDrawAndMethod('junk', 2)
  drawAndMeld = UltimateActionManager.createDrawAndMethod('meld', 2)
  drawAndReveal = UltimateActionManager.createDrawAndMethod('reveal', 2)
  drawAndReturn = UltimateActionManager.createDrawAndMethod('return', 2)
  drawAndSafeguard = UltimateActionManager.createDrawAndMethod('safeguard', 2)
  drawAndScore = UltimateActionManager.createDrawAndMethod('score', 2)
  drawAndTuck = UltimateActionManager.createDrawAndMethod('tuck', 2)


  ////////////////////////////////////////////////////////////////////////////////
  // Helper methods for creating common classes of action

  static createManyMethod(verb: string, numArgs: number): (...args: unknown[]) => Card[] {
    return function(this: UltimateActionManager, ...args: unknown[]): Card[] {
      const player = args[0] as UltimatePlayer
      const cards = args[1] as Card[]
      const opts = (args[numArgs] || {}) as { ordered?: boolean }

      const results: Card[] = []
      let auto = opts.ordered || false
      let remaining = [...cards]
      const startZones = Object.fromEntries(remaining.map((c: Card) => [c.id, c.zone]))

      while (remaining.length > 0) {
        // Check if any cards in 'remaining' have been acted on by some other force (karma effect).
        remaining = remaining.filter((c: Card) => c.zone.id === startZones[c.id].id)
        if (remaining.length === 0) {
          break
        }

        let next: Card | 'auto'
        if (auto || remaining.length === 1) {
          next = remaining[0]
        }
        else {
          next = this.chooseCard(
            player,
            (remaining as (Card | string)[]).concat(['auto']),
            { title: `Choose a card to ${verb} next.` },
          ) as Card | 'auto'
        }

        if (next === 'auto') {
          auto = true
          continue
        }

        remaining = remaining.filter((card: Card) => card !== next)
        const singleArgs = [...args]
        singleArgs[1] = next
        const result = (this as unknown as Record<string, (...args: unknown[]) => Card>)[verb](...singleArgs)
        if (result !== undefined) {
          results.push(result)
        }
      }
      return results
    }
  }

  static createChooseAndMethod(manyFuncName: string, numArgs: number): (...args: unknown[]) => Card[] {
    return function(this: UltimateActionManager, ...args: unknown[]): Card[] {
      const player = args[0] as UltimatePlayer
      const choices = args[1] as Card[]
      const opts = (args[numArgs] || {}) as ChooseOptions & { reveal?: boolean }

      const titleVerb = manyFuncName.slice(0, -4).toLowerCase()
      opts.title = opts.title || `Choose card(s) to ${titleVerb}`

      const cards = this.chooseCards(player, choices, opts)
      if (cards) {
        if (opts.reveal) {
          this.revealMany(player, cards)
        }

        const actionArgs = [...args]
        actionArgs[1] = cards
        return (this as unknown as Record<string, (...args: unknown[]) => Card[]>)[manyFuncName](...actionArgs)
      }
      else {
        return []
      }
    }
  }

  static createDrawAndMethod(verb: string, numArgs: number): (...args: unknown[]) => Card | undefined {
    return function(this: UltimateActionManager, ...args: unknown[]): Card | undefined {
      const player = args[0] as UltimatePlayer
      const age = args[1] as number
      const opts = (args[numArgs] || {}) as DrawOptions & { optional?: boolean }

      let doAction = true
      if (opts.optional) {
        doAction = this.chooseYesNo(player, `Do you want to ${verb}?`)
      }

      if (doAction) {
        const card = this.game.actions.draw(player, { ...opts, age })
        if (card) {
          return (this as unknown as Record<string, (player: UltimatePlayer, card: Card, opts: DrawOptions) => Card>)[verb](player, card, opts)
        }
      }
    }
  }

  static insteadKarmaWrapper(actionName: string, impl: ActionFunction): ActionFunction {
    return function(this: UltimateActionManager, player: UltimatePlayer, card: Card, opts: Record<string, unknown> = {}): Card | undefined {
      const karmaKind = this.game.aKarma(player, actionName, { ...opts, card })
      if (karmaKind === 'would-instead') {
        this.acted(player)
        return
      }

      return impl.call(this, player, card, opts)
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  // Helper functions

  // Used in two cases:
  //  1. Player melds a card onto an empty color stack.
  //  2. Player splays a color in a new direction.
  _maybeDrawCity(player: UltimatePlayer): void {
    if (!this.game.getExpansionList().includes('city')) {
      return
    }
    if (this.cards.byPlayer(player, 'hand').some((card: Card) => card.checkIsCity())) {
      return
    }

    this.draw(player, { exp: 'city' })
  }


}

module.exports = {
  UltimateActionManager,
}

export { UltimateActionManager }
