const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Miniturization`  // Card names are unique in Innovation
  this.name = `Miniturization`
  this.color = `red`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `hsis`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return a card from your hand. If you returned a {0}, draw a {0} for every different value of card in your score pile.`
  ]

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
