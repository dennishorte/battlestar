const Wrapper = require('./Wrapper.js')


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
    const toRemove = this.cardIdsByZone[zone].findIndex(id => id === card._id)
    if (toRemove === -1) {
      console.log('removeCard', card, zone)
      throw new Error('Card not found')
    }

    this.cardIdsByZone[zone].splice(toRemove, 1)
    this._cardsByZone[zone].splice(toRemove, 1)
    this._modified = true
    return this
  }

  setName(name) {
    if (this.name !== name) {
      this.name = name
      this._modified = true
    }
    return this
  }

  setFormat(format) {
    if (this.format !== format) {
      this.format = format
      this._modified = true
    }
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

  markSaved() {
    this._modified = false
    return this
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

  static fromGameJSON(json, cardWrapper) {
    const deck = new DeckWrapper(json.data)
    const cards = {
      main: json.cards.main.map(card => new cardWrapper(card)),
      side: json.cards.side.map(card => new cardWrapper(card)),
      command: json.cards.command.map(card => new cardWrapper(card)),
    }
    deck.setCardsByZone(cards)
    return deck
  }
}

module.exports = DeckWrapper
