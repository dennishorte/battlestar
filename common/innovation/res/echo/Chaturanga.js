const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Chaturanga`  // Card names are unique in Innovation
  this.name = `Chaturanga`
  this.color = `purple`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `c3ch`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld a card with a bonus from your hand. If you do, draw two cards of value equal to that card's bonus. Otherwise, draw and foreshadow a card of value equal to the number of top cards on your board.`
  ]

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
