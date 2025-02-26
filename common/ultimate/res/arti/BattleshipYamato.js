const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Battleship Yamato`  // Card names are unique in Innovation
  this.name = `Battleship Yamato`
  this.color = `red`
  this.age = 8
  this.visibleAge = 11
  this.expansion = `arti`
  this.biscuits = `_h__`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = ['This card counts as an age 11 card when on your board.']
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = [
    {}  // empty karma for the reminder text in the karma field
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
