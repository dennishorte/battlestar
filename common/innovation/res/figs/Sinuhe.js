const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Sinuhe`
  this.color = `purple`
  this.age = 1
  this.biscuits = `&llh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Draw and foreshadow a {2} or {3}.`
  this.triggers = [
    `You may issue a Rivaly Decree with any two figures.`,
    `Each {k} on your board provides one additional point towards your score.`
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
