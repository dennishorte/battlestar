const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Albert Einstein`  // Card names are unique in Innovation
  this.name = `Albert Einstein`
  this.color = `blue`
  this.age = 8
  this.expansion = `figs`
  this.biscuits = `hs&8`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Meld all cards from your hand with a {s} or {i}.`
  this.karma = [
    `You may issue an Advancement Decree with any two figures.`,
    `Each {} value in any of your effects counts as a {0}.`
  ]
  this.dogma = []

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
