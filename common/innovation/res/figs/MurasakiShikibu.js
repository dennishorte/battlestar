const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Murasaki Shikibu`
  this.color = `purple`
  this.age = 3
  this.biscuits = `sh4*`
  this.dogmaBiscuit = `s`
  this.inspire = `Draw a {3}.`
  this.echo = ``
  this.triggers = [
    `You may issue a Rivaly Decree with any two figures.`,
    `If you would claim a standard achievement, instead achieve a card of equal value from your score pile. Then claim the achievement, if you are still eligible.`
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
