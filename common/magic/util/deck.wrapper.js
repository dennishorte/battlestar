const Wrapper = require('./wrapper')

function _emptyZones() {
  return {
    main: [],
    side: [],
    command: [],
  }
}

class DeckWrapper extends Wrapper {
  constructor(deck) {
    super(deck)
    this._modified = false
    this._cardsByZone = undefined
  }

  async initializeCardsAsync(juicer) {
    this._cardsByZone = _emptyZones()
    for (const zone of Object.keys(this.cardIdsByZone)) {
      this._cardsByZone[zone] = await juicer(this.cardIdsByZone[zone])
    }
    return this
  }

  /**
     A juicer takes an array of cardIds and returns an array of CardWrapper objects matching those ids.
   */
  initializeCardsSync(juicer) {
    this._cardsByZone = _emptyZones()
    for (const zone of Object.keys(this.cardIdsByZone)) {
      this._cardsByZone[zone] = juicer(this.cardIdsByZone[zone])
    }
    return this
  }

  setCardsByZone(cards) {
    this._cardsByZone = cards
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
    return this
  }

  removeCard(card, zone) {
    const toRemove = this.cardIdsByZone[zone].findIndex(x => x._id === card._id)
    this.cardIdsByZone[zone].splice(toRemove, 1)
    this._cardsByZone[zone].splice(toRemove, 1)
    this._modified = true
    return this
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

  toGameJSON() {
    const deepcopy = (zone) => {
      return this._cardsByZone[zone].map(card => card.toJSON())
    }

    return {
      data: this.toJSON(),
      cards: {
        main: deepcopy('main'),
        side: deepcopy('side'),
        command: deepcopy('command'),
      }
    }
  }
}

module.exports = DeckWrapper
