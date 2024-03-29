const cardUtil = require('./cardUtil.js')
const util = require('../lib/util.js')


function Deck() {
  // Serialized Data
  this._id = undefined
  this.userId = ''
  this.name = ''
  this.path = ''
  this.createdTimestamp = Date.now()
  this.updatedTimestamp = this.createdTimestamp
  this.cardlist = []
  this.filters = []

  this.modified = false
}

module.exports = {
  Deck,
  deserialize,
}


function deserialize(data) {
  const deck = new Deck()

  deck._id = data._id
  deck.userId = data.userId
  deck.name = data.name
  deck.path = data.path
  deck.cardlist = data.cardlist
  deck.createdTimestamp = data.createdTimestamp
  deck.updatedTimestamp = data.updatedTimestamp
  deck.filters = data.filters

  return deck
}

Deck.prototype.serialize = function() {
  const serializedCardlist = util.deepcopy(this.cardlist)
  for (const card of serializedCardlist) {
    delete card.data
  }

  const data = {
    userId: this.userId,
    name: this.name,
    path: this.path,
    kind: 'deck',
    createdTimestamp: this.createdTimestamp,
    updatedTimestamp: this.updatedTimestamp,
    cardlist: serializedCardlist,
    filters: this.filters,
  }

  if (this._id) {
    data._id = this._id
  }

  return data
}

Deck.prototype.addCard = function(card, zone) {
  const item = {
    name: card.name,
    set: card.set,
    collector_number: card.collector_number,
    zone,
  }

  if (card.data) {
    item.data = card.data
  }
  else if (card.card_faces) {
    item.data = card
  }

  this.cardlist.push(item)
}

Deck.prototype.clearCards = function() {
  this.cardlist = []
}

Deck.prototype.removeCard = function(card, zone) {
  // Remove exact matches
  const exactIndex = this.cardlist.findIndex(data => {
    return data.zone === zone && cardUtil.strictEquals(data, card)
  })
  if (exactIndex >= 0) {
    this.cardlist.splice(exactIndex, 1)
    return
  }

  // Remove soft matches
  const softIndex = this.cardlist.findIndex(data => {
    return data.zone === zone && cardUtil.softEquals(data, card)
  })
  if (softIndex >= 0) {
    this.cardlist.splice(softIndex, 1)
    return
  }

  throw new Error('Cannot remove card; not found: ' + JSON.stringify(card, null, 2))
}

Deck.prototype.setDecklist = function(cards) {
  this.cardlist = cards
}
