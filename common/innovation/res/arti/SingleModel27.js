const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Single Model 27`  // Card names are unique in Innovation
  this.name = `Single Model 27`
  this.color = `yellow`
  this.age = 7
  this.expansion = `arti`
  this.biscuits = `hfii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Tuck a card from your hand. If you do, splay up its color, and then tuck all cards from your score pile of that color.`
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
