const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Charles Darwin`
  this.color = `blue`
  this.age = 7
  this.biscuits = `&8hs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw an {8}.`
  this.triggers = [
    `You may issue an Advancement Decree with any two figures.`,
    `If you would claim an achievement, first if no other player has as many or more achievements as you, instead you win.`
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
