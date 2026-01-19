import util from '../lib/util.js'

// Forward declarations for types
interface Game {
  log: {
    add: (entry: unknown) => void
  }
  players: {
    byZone: (zone: Zone) => Player | undefined
  }
  random: () => number
}

interface Player {
  name: string
}

interface Card {
  zone: string | undefined
  home: string | undefined
  visibility: Player[]
  name: () => string
}

export interface Zone {
  id: string
  game: Game
  name: string
  kind: string
  owner: Player | undefined
  _cards: Card[]
  cards(): Card[]
  getOwner(): Player | undefined
  addCard(card: Card): void
  removeCard(card: Card): void
  setCards(cards: Card[]): void
  shuffle(opts?: { silent?: boolean }): void
  shuffleBottom(count: number, opts?: { silent?: boolean }): void
  sortCardsByName(): void
}

interface ZoneConstructor {
  new (game: Game, name: string, kind: string): Zone
  (this: Zone, game: Game, name: string, kind: string): void
}

interface PlayerZoneConstructor {
  new (game: Game, player: Player, name: string, kind: string): Zone
  (this: Zone, game: Game, player: Player, name: string, kind: string): void
}

function Zone(this: Zone, game: Game, name: string, kind: string): void {
  this.id = name
  this.game = game
  this.name = name
  this.kind = kind
  this.owner = undefined
  this._cards = []
}

function PlayerZone(this: Zone, game: Game, player: Player, name: string, kind: string): void {
  this.id = 'players.' + player.name + '.' + name
  this.game = game
  this.name = name
  this.kind = kind
  this.owner = player
  this._cards = []
}
util.inherit(Zone, PlayerZone)

Zone.prototype.cards = function(this: Zone): Card[] {
  util.assert(this._cards.every((card: Card) => card !== undefined), 'Found an undefined card in _cards')
  return [...this._cards]
}

Zone.prototype.getOwner = function(this: Zone): Player | undefined {
  return this.game.players.byZone(this)
}

Zone.prototype.addCard = function(this: Zone, card: Card): void {
  util.assert(card !== undefined, 'Cannot add undefined to deck')

  card.zone = this.id
  card.home = this.id
  this._cards.push(card)
}

Zone.prototype.removeCard = function(this: Zone, card: Card): void {
  card.zone = undefined
  util.array.remove(this._cards, card)
}

Zone.prototype.setCards = function(this: Zone, cards: Card[]): void {
  util.assert(Array.isArray(cards), `Cards parameter must be an array. Got ${typeof cards}.`)
  util.assert(cards.every((card: Card) => card !== undefined), 'Cannot include undefined in cards')

  this._cards = [...cards]
  this._cards.forEach((c: Card) => {
    c.zone = this.id
    c.home = this.id
  })
}

Zone.prototype.shuffle = function(this: Zone, opts: { silent?: boolean } = {}): void {
  if (!opts.silent) {
    this.game.log.add({
      template: "{zone} shuffled",
      args: {
        player: this.owner,
        zone: this
      }
    })
  }

  util.array.shuffle(this._cards, this.game.random)
  if (this.kind === 'hidden') {
    this._cards.forEach((card: Card) => card.visibility = [])
  }
  else if (this.kind === 'private') {
    this._cards.forEach((card: Card) => card.visibility = [this.owner as Player])
  }
}

Zone.prototype.shuffleBottom = function(this: Zone, count: number, opts: { silent?: boolean } = {}): void {
  if (!opts.silent) {
    this.game.log.add({
      template: `{player}'s {zone} bottom ${count} shuffled`,
      args: { player: this.owner, zone: this },
    })
  }

  const toShuffle = this._cards.slice(-count)
  util.array.shuffle(toShuffle, this.game.random)
  this._cards.splice(this._cards.length - count, count, ...toShuffle)

  if (this.kind === 'hidden') {
    toShuffle.forEach((card: Card) => card.visibility = [])
  }
  else if (this.kind === 'private') {
    toShuffle.forEach((card: Card) => card.visibility = [this.owner as Player])
  }
}

Zone.prototype.sortCardsByName = function(this: Zone): void {
  this._cards.sort((l: Card, r: Card) => l.name().localeCompare(r.name()))
}

export {
  PlayerZone as PlayerZone,
  Zone as Zone,
}
export type { ZoneConstructor, PlayerZoneConstructor }
