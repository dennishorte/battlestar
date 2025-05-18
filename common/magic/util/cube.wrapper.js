const Wrapper = require('./wrapper.js')
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

  achievements() {
    return [...this.achievementlist]
  }

  scars() {
    return [...this.scarlist]
  }

  upsertScar(scar) {
    const existingIndex = this.scars().findIndex(s => s.id === scar.id)
    if (scar.id === null || existingIndex === -1) {
      scar.id = 'scar-' + this.scars().length
      this.scarlist.push(scar)
    }
    else {
      this.scarlist[existingIndex] = scar
    }
  }
}

module.exports = CubeWrapper
