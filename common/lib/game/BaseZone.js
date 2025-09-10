const { GameProxy } = require('./GameProxy.js')
const util = require('../util.js')

const ZONE_KIND = {
  public: 'public',
  private: 'private',
  hidden: 'hidden'
}


class BaseZone {
  constructor(game, id, name, kind, owner=null) {
    this.id = id
    this.game = game

    this._name = name
    this._kind = kind
    this._owner = owner

    const proxy = GameProxy.create(this)
    this.reset.call(proxy)
    return proxy
  }

  cardlist() {
    return [...this._cards]
  }

  kind() {
    return this._kind
  }

  name() {
    return this._name
  }

  owner() {
    return this._owner
  }

  initializeCards(cards) {
    if (this._initialized) {
      throw new Error('Zone already initialized')
    }

    this._initialized = true
    this._cards = [...cards]
    for (const card of this._cards) {
      card.setHome(this)
      card.setZone(this)
      this._updateCardVisibility(card)
    }
  }

  reset() {
    this._cards = []
    this._initialized = false
  }

  /**
   * Negative indices push from the back of the cards array, the same as with array.splice.
   */
  push(card, index) {
    if (card.zone) {
      card.zone.remove(card)
    }

    if (index > this._cards.length) {
      throw new Error('Index out of bounds: ' + index)
    }
    this._cards.splice(index, 0, card)
    this._updateCardVisibility(card)

    card.setZone(this)
  }

  peek(index=0) {
    return this._cards.at(index)
  }

  remove(card) {
    const index = this._cards.findIndex(c => c.id === card.id)
    if (index === -1) {
      throw new Error(`Card (${card.id}) not found in zone (${this.id})`)
    }
    this._cards.splice(index, 1)
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Misc

  random() {
    return util.array.select(this._cards, this.game.random)
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
    this.sort((l, r) => {
      const lName = typeof l.name === 'function' ? l.name() : l.name
      const rName = typeof r.name === 'function' ? r.name() : r.name
      return lName.localeCompare(rName)
    })
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

  ////////////////////////////////////////////////////////////////////////////////
  // Protected
  _updateCardVisibility(card) {
    switch (this._kind) {
      case ZONE_KIND.public:
        card.reveal()
        break

      case ZONE_KIND.private:
        card.show(this.owner())
        break

      case ZONE_KIND.hidden:
        card.hide()
        break

      default:
        throw new Error('Unknown zone kind: ' + this._kind)
    }
  }
}

module.exports = {
  BaseZone,
  ZONE_KIND,
}
