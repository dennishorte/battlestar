const util = require('../../lib/util.js')

interface Player {
  name: string
}

interface Card {
  id: string
  name: string
  age: number
  color: string
  biscuits: string
  zone: Zone
  isMuseum?: boolean
  moveTo(zone: Zone, position?: number): void
  getAge(): number
  getHexIndex(): number
  visibleBiscuits(): string
  checkIsCity(): boolean
  checkHasBiscuit(biscuit: string): boolean
  checkHasDiscoverBiscuit(): boolean
}

interface Zone {
  id: string
  splay: string
  isMuseumZone(): boolean
  cardlist(): Card[]
}

interface ZoneManager {
  byPlayer(player: Player, zone: string): Zone
}

interface CardManager {
  byId(id: string): Card
  byPlayer(player: Player, zone: string): Card[]
  byDeck(exp: string, age: number): Card[]
}

interface PlayerManager {
  opponents(player: Player): Player[]
}

interface Log {
  add(entry: { template: string; args?: Record<string, unknown> }): void
  indent(): void
  outdent(): void
}

interface GameStats {
  melded: string[]
  meldedBy: Record<string, string>
  highestMelded: number
  firstToMeldOfAge: [number, string][]
}

interface Game {
  aKarma(player: Player, trigger: string, opts?: Record<string, unknown>): string | undefined
  getExpansionList(): string[]
  stats: GameStats
  actions: ActionManager
  cards: CardManager
}

interface ActionManager {
  game: Game
  zones: ZoneManager
  cards: CardManager
  players: PlayerManager
  log: Log
  acted(player: Player): void
  draw(player: Player, opts?: { age?: number; exp?: string }): Card
  splay(player: Player, color: string, direction: string): void
  unsplay(player: Player, color: string): void
  junkDeck(player: Player, age: number): void
  junkAvailableAchievement(player: Player, ages: number[]): void
  claimAchievement(player: Player, opts: { name: string }): void
  return(player: Player, card: Card): void
  reveal(player: Player, card: Card): void
  chooseAndMeld(player: Player, choices: Card[]): Card[]
  dogma(player: Player, card: Card, opts?: { foreseen?: boolean }): void
  digArtifact(player: Player, age: number): void
  _maybeDrawCity(player: Player, opts?: Record<string, unknown>): void
}

interface MeldOptions {
  asAction?: boolean
  [key: string]: unknown
}

function MeldAction(this: ActionManager, player: Player, card: Card, opts: MeldOptions = {}): Card | undefined {
  // TODO: Figure out how to convert this to use UltimateActionManager.insteadKarmaWrapper
  const karmaKind = this.game.aKarma(player, 'meld', { ...opts, card })
  if (karmaKind === 'would-instead') {
    this.acted(player)
    return
  }

  const isFirstCard = this.cards.byPlayer(player, card.color).length === 0

  // If this card is in a museum, a museum card must be returned.
  const fromMuseum = card.zone.isMuseumZone()

  card.moveTo(this.zones.byPlayer(player, card.color), 0)

  this.log.add({
    template: '{player} melds {card}',
    args: { player, card }
  })

  this.game.aKarma(player, 'when-meld', { ...opts, card })

  if (fromMuseum) {
    const museum = this.cards.byPlayer(player, 'museum').filter((card: Card) => card.isMuseum)[0]
    this.return(player, museum)
  }

  this.acted(player)

  // Stats
  _statsCardWasMelded.call(this, card)
  _statsCardWasMeldedBy.call(this, player, card)
  _statsFirstToMeldOfAge.call(this, player, card)

  this.log.indent()

  _maybeCityMeldAchievements.call(this, player, card)

  if (opts.asAction) {
    _maybeCityBiscuits.call(this, player, card)
    _maybeDiscoverBiscuit.call(this, player, card)
    if (isFirstCard) {
      this._maybeDrawCity(player, opts)
    }
    _maybeDigArtifact.call(this, player, card)
    _maybePromote.call(this, player, card)
  }

  this.log.outdent()
  return card
}

function _maybeCityBiscuits(this: ActionManager, player: Player, card: Card): void {
  const biscuits = card.visibleBiscuits()

  for (const biscuit of biscuits) {
    switch (biscuit) {
      case '+':
        this.draw(player, { age: card.age + 1 })
        break
      case '<':
        this.splay(player, card.color, 'left')
        break
      case '>':
        this.splay(player, card.color, 'right')
        break
      case '^':
        this.splay(player, card.color, 'up')
        break
      case '=':
        for (const opp of this.players.opponents(player)) {
          this.game.actions.unsplay(opp, card.color)
        }
        break
      case '|':
        this.junkDeck(player, card.getAge() + 1)
        this.draw(player, { age: card.getAge() + 2 })
        break
      case 'x':
        this.junkAvailableAchievement(player, [card.getAge()])
        break
      default:
        // Most biscuits don't do anything special.
        break
    }
  }
}

function _maybeCityMeldAchievements(this: ActionManager, player: Player, card: Card): void {
  if (
    card.checkHasBiscuit('<')
    && this.zones.byPlayer(player, card.color).splay === 'left'
    && this.cards.byId('Tradition').zone.id === 'achievements'
  ) {
    this.claimAchievement(player, { name: 'Tradition' })
  }

  if (
    card.checkHasBiscuit('>')
    && this.zones.byPlayer(player, card.color).splay === 'right'
    && this.cards.byId('Repute').zone.id === 'achievements'
  ) {
    this.claimAchievement(player, { name: 'Repute' })
  }

  if (
    card.checkHasBiscuit('^')
    && this.zones.byPlayer(player, card.color).splay === 'up'
    && this.cards.byId('Fame').zone.id === 'achievements'
  ) {
    this.claimAchievement(player, { name: 'Fame' })
  }
}

function _maybeDiscoverBiscuit(this: ActionManager, player: Player, card: Card): void {
  if (card.checkHasDiscoverBiscuit()) {
    const age = card.getAge()
    const biscuit = card.biscuits[4]
    const maxDraw = this.cards.byDeck('base', age).length
    const numDraw = Math.min(maxDraw, age)

    for (let i = 0; i < numDraw; i++) {
      const drawnCard = this.draw(player, { exp: 'base', age })
      this.reveal(player, drawnCard)
      if (!drawnCard.checkHasBiscuit(biscuit)) {
        this.return(player, drawnCard)
      }
    }
  }
}

function _maybeDigArtifact(this: ActionManager, player: Player, card: Card): void {
  if (!this.game.getExpansionList().includes('arti')) {
    return
  }

  const next = this.cards.byPlayer(player, card.color)[1]

  // No card underneath, so no artifact dig possible.
  if (!next) {
    return
  }

  // Dig up an artifact if player melded a card of lesser or equal age of the previous top card.
  if (next.getAge() >= card.getAge()) {
    this.game.actions.digArtifact(player, next.getAge())
    return
  }

  // Dig up an artifact if the melded card has its hex icon in the same position.
  if (next.getHexIndex() === card.getHexIndex()) {
    this.game.actions.digArtifact(player, next.getAge())
    return
  }
}

function _maybePromote(this: ActionManager, player: Player, card: Card): void {
  const choices = this
    .game
    .cards
    .byPlayer(player, 'forecast')
    .filter((other: Card) => other.getAge() <= card.getAge())

  if (choices.length > 0) {
    this.log.add({
      template: '{player} must promote a card from forecast',
      args: { player },
    })
    const cards = this.chooseAndMeld(player, choices)
    if (cards && cards.length > 0) {
      const melded = cards[0]
      this.dogma(player, melded, { foreseen: true })
    }
  }
}

function _statsCardWasMelded(this: ActionManager, card: Card): void {
  util.array.pushUnique(this.game.stats.melded, card.name)
}

function _statsCardWasMeldedBy(this: ActionManager, player: Player, card: Card): void {
  if (card.name in this.game.stats.meldedBy) {
    return
  }
  else {
    this.game.stats.meldedBy[card.name] = player.name
  }
}

function _statsFirstToMeldOfAge(this: ActionManager, player: Player, card: Card): void {
  if (card.age > this.game.stats.highestMelded) {
    this.game.stats.firstToMeldOfAge.push([card.age, player.name])
    this.game.stats.highestMelded = card.age
  }
}

module.exports = {
  MeldAction
}

export { MeldAction }
export type { MeldOptions }
