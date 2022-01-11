const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Charles Darwin`  // Card names are unique in Innovation
  this.name = `Charles Darwin`
  this.color = `blue`
  this.age = 7
  this.expansion = `figs`
  this.biscuits = `&8hs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw an {8}.`
  this.karma = [
    `You may issue an Advancement Decree with any two figures.`,
    `If you would claim an achievement, first if no other player has as many or more achievements as you, instead you win.`
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
