const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sejong the Great`  // Card names are unique in Innovation
  this.name = `Sejong the Great`
  this.color = `blue`
  this.age = 3
  this.expansion = `figs`
  this.biscuits = `&3hs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw and meld a {4}.`
  this.karma = [
    `You may issue an advancement decree with any two figures.`,
    `If you would meld a blue card of value above 3, instead return it and draw and meld a card of value one higher.`
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
