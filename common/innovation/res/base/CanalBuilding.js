const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Canal Building`
  this.color = `yellow`
  this.age = 2
  this.biscuits = `hclc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `You may exchange all the highest cards in your hand with all the highest cards in your score pile.`
  ]

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.triggerImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
