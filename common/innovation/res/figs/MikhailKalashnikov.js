const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Mikhail Kalashnikov`
  this.color = `red`
  this.age = 9
  this.biscuits = `*ffh`
  this.dogmaBiscuit = `f`
  this.inspire = `Tuck a card from your hand.`
  this.echo = ``
  this.triggers = [
    `If you would tuck a red card, instead choose a top red card on an opponent's board. Either transfer it to your score pile, or execute its non-demand Dogma effects for yourself only.`
  ]
  this.dogma = []

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
