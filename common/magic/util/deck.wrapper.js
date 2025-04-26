const Wrapper = require('./wrapper')

class DeckWrapper extends Wrapper {
  constructor(deck) {
    super(deck)
    this._modified = false
    this._cardsByZone = undefined
  }

  async initializeCards(juicer) {
    this._cardsByZone = {}
    for (const key of Object.keys(this.cardIdsByZone)) {
      const juiced = juicer(this.cardIdsByZone[key])
      this._cardsByZone[key] = juiced instanceof Promise ? await juiced : juiced
    }
  }

  cards(zone) {
    if (!this.ready()) {
      throw new Error('cards not loaded')
    }
    return [...this._cardsByZone[zone]]
  }

  addCard(card, zone) {
    this.cardIdsByZone[zone].push(card._id)
    this._cardsByZone[zone].push(card)
    this._modified = true
  }

  removeCard(card, zone) {
    const toRemove = this.cardIdsByZone[zone].findIndex(x => x._id === card._id)
    this.cardIdsByZone[zone].slice(toRemove, 1)
    this._cardsByZone[zone].slice(toRemove, 1)
    this._modified = true
  }

  isModified() {
    return this._modified
  }

  getCardCount(zone) {
    return this.cardIdsByZone[zone].length
  }

  ready() {
    return this._cardsByZone !== undefined
  }

  zones() {
    return Object.keys(this.cardIdsByZone)
  }
}

module.exports = DeckWrapper
