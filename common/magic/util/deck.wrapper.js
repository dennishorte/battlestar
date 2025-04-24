const Wrapper = require('./wrapper')

class DeckWrapper extends Wrapper {
  constructor(deck) {
    super(deck)
    this._modified = false
  }

  addCard(card, zone) {
    this.cardIdsByZone[zone].push(card._id)
    this._modified = true
  }

  removeCard(card, zone) {
    this.cardIdsByZone[zone] = this.cardIdsByZone[zone].filter(id => id !== card._id)
    this._modified = true
  }

  isModified() {
    return this._modified
  }

  getCardCount(zone) {
    return this.cardIdsByZone[zone].length
  }
}

module.exports = DeckWrapper
