import cardUtil from './cardUtil.js'


function Deck(cardLookup) {
  // Serialized Data
  this._id = undefined
  this.userId = ''
  this.name = ''
  this.path = ''
  this.createdTimestamp = Date.now()
  this.updatedTimestamp = this.createdTimestamp
  this.cardlist = []

  this.modified = false
}

export default {
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

  return deck
}

Deck.prototype.serialize = function() {
  const data = {
    userId: this.userId,
    name: this.name,
    path: this.path,
    createdTimestamp: this.createdTimestamp,
    updatedTimestamp: this.updatedTimestamp,
    cardlist: this.cardlist,
  }

  if (this._id) {
    data._id = this._id
  }

  return data
}

Deck.prototype.addCard = function(card, zone) {
  this.cardlist.push({
    name: card.name,
    set: card.set,
    collector_number: card.collector_number,
    zone,
  })
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
