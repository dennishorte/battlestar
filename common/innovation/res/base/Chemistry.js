const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Chemistry`
  this.color = `blue`
  this.age = 5
  this.biscuits = `fsfh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `You may splay your blue cards right.`,
    `Draw and score a card of value one higher than the highest top card on your board and then return a card from your score pile.`
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
