const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Edward Jenner`  // Card names are unique in Innovation
  this.name = `Edward Jenner`
  this.color = `yellow`
  this.age = 6
  this.expansion = `figs`
  this.biscuits = `*llh`
  this.dogmaBiscuit = `l`
  this.inspire = `Tuck a card from your hand.`
  this.echo = ``
  this.karma = [
    `If a player would successfully demand something of you, instead return a card from your hand.`
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
