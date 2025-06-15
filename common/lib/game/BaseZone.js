const util = require('../util.js')


class BaseZone {
  constructor(game, name, kind) {
    this.game = game

    /**
     * Index 0 = top of the deck
     */
    this._cards = []

    this._id = name
    this._name = name
    this._kind = kind
    this._owner = undefined
  }

  cards() {
    return [...this._cards]
  }

  owner() {
    return this._owner
  }

  /**
   * Negative indices push from the back of the cards array, the same as with array.splice.
   */
  push(card, index=null) {
    if (index !== null) {
      if (index > this._cards.length) {
        throw new Error('Index out of bounds: ' + index)
      }
      this._cards.splice(index, 0, card)
    }
    else {
      this._cards.push(card)
    }
  }

  remove(card) {
    const index = this._cards.indexOf(card)
    if (index === -1) {
      throw new Error(`Card (${card.id}) not found in zone (${this._id})`)
    }
    this._cards.splice(index, 1)
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Misc

  random() {
    return util.array.select(this._cards)
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Ordering

  shuffle() {
    util.array.shuffle(this._cards, this.game.random)
  }

  shuffleTop(count) {
    if (!count || count < 1 || count > this._cards.length) {
      throw new Error(`Invalid count: ${count}`)
    }

    const topCards = this._cards.slice(0, count)
    util.array.shuffle(topCards, this.game.random)

    // Replace the top cards with the shuffled ones using splice
    this._cards.splice(0, count, ...topCards)
  }

  shuffleBottom(count) {
    if (!count || count < 1 || count > this._cards.length) {
      throw new Error(`Invalid count: ${count}`)
    }

    const startIndex = this._cards.length - count
    const bottomCards = this._cards.slice(startIndex)
    util.array.shuffle(bottomCards, this.game.random)

    // Replace the bottom cards with the shuffled ones using splice
    this._cards.splice(startIndex, count, ...bottomCards)
  }

  shuffleBottomVisible() {
    throw new Error('not implemented')
  }

  sort(fn) {
    this._cards.sort((l, r) => fn(l, r))
  }

  sortByName() {
    this.sort((l, r) => l.name().localeCompare(r.name()))
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Visibility

  hide() {
    this._cards.forEach(card => card.hide())
  }

  reveal() {
    this._cards.forEach(card => card.reveal())
  }

  revealNext() {
    for (let i = 0; i < this._cards.length; i++) {
      const card = this._cards[i]
      if (!card.revealed()) {
        card.reveal()
        break
      }
    }
  }

  revealRandom() {
    const card = util.array.select(this._cards, this.game.random)
    card.reveal()
  }

  show(player) {
    this._cards.forEach(card => card.show(player))
  }

  showNext(player) {
    for (let i = 0; i < this._cards.length; i++) {
      const card = this._cards[i]
      if (!card.visible(player)) {
        card.show(player)
        break
      }
    }
  }

  showRandom(player) {
    const card = util.array.select(this._cards, this.game.random)
    card.show(player)
  }
}

module.exports = {
  BaseZone
}
