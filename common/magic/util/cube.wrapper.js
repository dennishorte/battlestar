const Wrapper = require('./wrapper')
const util = require('../../lib/util.js')

class CubeWrapper extends Wrapper {
  constructor(cube) {
    super(cube)
    this.props = {
      cards: null,
    }
  }

  addCard(card) {
    this.cardlist.push(card.id)
    this.props.cards.push(card)
  }

  removeCard(card) {
    util.array.remove(this.cardlist, card.id)
    util.array.removeByPredicate(this.props.cards, (x) => x.id === card.id)
  }

  cards() {
    if (!this.props.cards) {
      throw new Error('card data has not been loaded')
    }
    return [...this.props.cards]
  }

  setCards(data) {
    this.props.cards = [...data]
  }

  applyFilters(filters) {
    return this.cards().filter(card => card.matchesFilters(filters))
  }
}

module.exports = CubeWrapper
