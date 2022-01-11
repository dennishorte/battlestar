const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Canal Building`  // Card names are unique in Innovation
  this.name = `Canal Building`
  this.color = `yellow`
  this.age = 2
  this.expansion = `base`
  this.biscuits = `hclc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may exchange all the highest cards in your hand with all the highest cards in your score pile.`
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
