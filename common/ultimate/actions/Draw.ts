interface Player {
  name: string
}

interface Card {
  moveTo(zone: Zone): void
  getAge(): number
}

interface Zone {
  cardlist(): Card[]
  peek(): Card | null
}

interface ZoneManager {
  byDeck(exp: string, age: number): Zone
  byPlayer(player: Player, zone: string): Zone
}

interface CardManager {
  tops(player: Player): Card[]
}

interface PlayerManager {
  all(): Player[]
}

interface UltimateUtils {
  colors(): string[]
}

interface KarmaInfo {
  impl: {
    matches(game: unknown, player: Player, opts: { action: string; color: string; isAction?: boolean }): boolean
    func(game: unknown, player: Player, opts: { color: string }): number
  }
}

interface GameSettings {
  version: number
}

interface Game {
  getMinAge(): number
  getMaxAge(): number
  getScore(player: Player): number
  getAchievementsByPlayer(player: Player): { total: number }
  getExpansionList(): string[]
  youWin(player: Player, reason: string): void
  settings: GameSettings
  checkIsFirstBaseDraw(player: Player): boolean
  mSetFirstBaseDraw(player: Player): void
  aKarma(player: Player, trigger: string, opts?: Record<string, unknown>): string | undefined
  getInfoByKarmaTrigger(player: Player, trigger: string, opts?: Record<string, unknown>): KarmaInfo[]
  checkInKarma(): boolean
  util: UltimateUtils
  players: PlayerManager
}

interface ActionManager {
  game: Game
  zones: ZoneManager
  cards: CardManager
  log: {
    add(entry: { template: string; args?: Record<string, unknown> }): void
  }
  acted(player: Player): void
  _karmaIn(): void
  _karmaOut(): void
}

interface DrawOptions {
  age?: number
  isAction?: boolean
  exp?: string
  silent?: boolean
  [key: string]: unknown
}

function DrawAction(this: ActionManager, player: Player, opts: DrawOptions = {}): Card | undefined {
  const { age, isAction } = opts

  if (isAction) {
    const karmaKind = this.game.aKarma(player, 'draw-action', opts)
    if (karmaKind === 'would-instead') {
      this.acted(player)
      return
    }
  }

  // Expansion the user should draw from, before looking at empty decks.
  const baseExp = opts.exp || _determineBaseDrawExpansion.call(this, player)

  // If age is not specified, draw based on player's current highest top card.
  const highestTopAge = _getAgeForDrawAction.call(this, player, isAction)
  const minAge = this.game.getMinAge()
  const baseAge = age !== undefined ? (age || minAge) : (highestTopAge || minAge)

  // Adjust age based on empty decks.
  let [adjustedAge, adjustedExp] = _adjustedDrawDeck.call(this, baseAge, baseExp)

  const karmaKind = this.game.aKarma(player, 'draw', { ...opts, age: adjustedAge, exp: adjustedExp })
  if (karmaKind === 'would-instead') {
    this.acted(player)
    return
  }
  else if (karmaKind === 'would-first') {
    // Some effects junk decks, which might affect the draw age.
    [adjustedAge, adjustedExp] = _adjustedDrawDeck.call(this, baseAge, baseExp)
  }

  return _doDraw.call(this, player, adjustedExp, adjustedAge, opts)
}


function _doDraw(this: ActionManager, player: Player, exp: string, age: number, opts: DrawOptions = {}): Card | undefined {
  if (age > this.game.getMaxAge()) {
    const scores = this
      .game
      .players
      .all()
      .map(player => ({
        player,
        score: this.game.getScore(player),
        achs: this.game.getAchievementsByPlayer(player).total,
        reason: '',
      }))
      .sort((l, r) => {
        if (r.score !== l.score) {
          r.reason = 'high draw'
          l.reason = 'high draw'
          return r.score - l.score
        }
        else if (r.achs !== l.achs) {
          r.reason = 'high draw - tie breaker (achievements)'
          l.reason = 'high draw - tie breaker (achievements)'
          return r.achs - l.achs
        }
        else {
          this.game.youWin(player, 'Tied for points and achievements; player who drew the big card wins!')
          return 0
        }
      })

    this.game.youWin(scores[0].player, scores[0].reason)
  }

  const source = this.zones.byDeck(exp, age)
  const hand = this.zones.byPlayer(player, 'hand')
  const card = source.peek()!
  card.moveTo(hand)

  if (!opts.silent) {
    this.log.add({
      template: '{player} draws {card}',
      args: { player, card }
    })
  }

  this.acted(player)
  return card
}

function _adjustedDrawDeck(this: ActionManager, age: number, exp: string): [number, string] {
  if (age > this.game.getMaxAge()) {
    return [12, 'base']
  }

  const baseDeck = this.zones.byDeck('base', age)
  if (baseDeck.cardlist().length === 0) {
    return _adjustedDrawDeck.call(this, age + 1, exp)
  }

  if (exp === 'base') {
    return [age, 'base']
  }

  const expDeck = this.zones.byDeck(exp, age)
  if (expDeck.cardlist().length === 0) {
    return [age, 'base']
  }

  return [age, exp]
}

// Determine which expansion to draw from.
// If playing with more than one of Figures, Echoes, and The Unseen, the draw
// rule for Figures is checked first, then Echoes, then Unseen.
function _determineBaseDrawExpansion(this: ActionManager, player: Player): string {
  // Whether the player ends up drawing echoes, unseen, or base, this counts as their
  // first base draw, and so following draws won't draw unseen cards.
  const isFirstBaseDraw = this.game.checkIsFirstBaseDraw(player)
  if (isFirstBaseDraw) {
    this.game.mSetFirstBaseDraw(player)
  }

  if (this.game.settings.version < 5) {
    if (this.game.getExpansionList().includes('echo')) {
      const topAges = this
        .cards
        .tops(player)
        .map((c: Card) => c.getAge())
        .sort((l: number, r: number) => l - r)
        .reverse()

      if (topAges.length === 1 || (topAges.length > 1 && topAges[0] != topAges[1])) {
        return 'echo'
      }
    }
    if (this.game.getExpansionList().includes('usee')) {
      if (isFirstBaseDraw) {
        return 'usee'
      }
    }
    return 'base'
  }
  else {
    let exp = 'base'

    if (this.game.getExpansionList().includes('echo')) {
      const topAges = this
        .cards
        .tops(player)
        .map((c: Card) => c.getAge())
        .sort((l: number, r: number) => l - r)
        .reverse()

      if (topAges.length === 1 || (topAges.length > 1 && topAges[0] != topAges[1])) {
        exp = 'echo'
      }
    }
    if (this.game.getExpansionList().includes('usee')) {
      if (isFirstBaseDraw) {
        exp = 'usee'
      }
    }
    return exp
  }
}

function _getAgeForDrawAction(this: ActionManager, player: Player, isAction?: boolean): number {
  const karmaInfos = this.game.getInfoByKarmaTrigger(player, 'top-card-value', { isAction })

  if (karmaInfos.length > 1) {
    throw new Error('Too many karma infos for top-card-value. I do not know what to do.')
  }

  const ageValues = this
    .game
    .util.colors()
    .map((color: string) => {
      const zone = this.zones.byPlayer(player, color)
      if (zone.cardlist().length === 0) {
        return this.game.getMinAge()
      }

      const actionType = isAction ? 'draw' : 'other'
      const karmaMatches = (
        !this.game.checkInKarma()
        && karmaInfos.length === 1
        && karmaInfos[0].impl.matches(this as unknown as Game, player, { action: actionType, color, isAction })
      )
      if (karmaMatches) {
        this._karmaIn()
        const result = karmaInfos[0].impl.func(this as unknown as Game, player, { color })
        this._karmaOut()
        return result
      }
      else {
        return zone.cardlist()[0].getAge()
      }
    })

  return Math.max(...ageValues)
}



export { DrawAction }
export type { DrawOptions }
