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


  ////////////////////////////////////////////////////////////////////////////////
  // Scars

  static blankScar() {
    return {
      id: null,
      text: '',
      createdAt: new Date(),
      createdBy: null,
      appliedTo: null,
      appliedBy: null,
      appliedAt: null,
    }
  }

  scars() {
    return [...this.scarlist]
  }

  deleteScar(scar) {
    const index = this.scars().findIndex(s => s.text === scar.text)
    this.scarlist.splice(index, 1)
  }

  getScarById(id) {
    return this.scars().find(s => s.id === id)
  }

  upsertScar(scar) {
    const existingIndex = this.scars().findIndex(s => s.id === scar.id)
    if (scar.id === null || existingIndex === -1) {
      scar.id = 'scar-' + _nextScarIndex(this.scars())
      this.scarlist.push(scar)
    }
    else {
      this.scarlist[existingIndex] = scar
    }
  }
}

function _nextScarIndex(scars) {
  if (scars.length === 0) {
    return 1
  }

  const indices = scars.map(s => s.id.substring('scar-'.length)).map(x => parseInt(x))
  return Math.max(...indices) + 1
}

module.exports = CubeWrapper
