const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Carl Friedrich Gauss`  // Card names are unique in Innovation
  this.name = `Carl Friedrich Gauss`
  this.color = `blue`
  this.age = 6
  this.expansion = `figs`
  this.biscuits = `ss&h`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw a {7}.`
  this.karma = [
    `If you would meld a card, first choose a value and meld all cards of that value from your hand and score pile.`
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
