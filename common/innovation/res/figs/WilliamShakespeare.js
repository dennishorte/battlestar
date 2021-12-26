const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `William Shakespeare`
  this.color = `purple`
  this.age = 4
  this.biscuits = `4*hs`
  this.dogmaBiscuit = `s`
  this.inspire = `Meld a card from your hand.`
  this.echo = ``
  this.triggers = [
    `You may issue a Rivaly Decree with any two figures.`,
    `Each HEX on your board provides one additional point toward your score.`
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
