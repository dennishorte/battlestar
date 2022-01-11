const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Benjanmin Franklin`  // Card names are unique in Innovation
  this.name = `Benjanmin Franklin`
  this.color = `blue`
  this.age = 6
  this.expansion = `figs`
  this.biscuits = `s&h6`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Take a top figure into your hand from any player's board. Meld it.`
  this.karma = [
    `You may issue an Advancement Decree with any two figures.`,
    `If you would meld a card, first draw and meld a card of one higher value.`
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
