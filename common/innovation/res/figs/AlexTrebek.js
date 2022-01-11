const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Alex Trebek`  // Card names are unique in Innovation
  this.name = `Alex Trebek`
  this.color = `yellow`
  this.age = 10
  this.expansion = `figs`
  this.biscuits = `sh*s`
  this.dogmaBiscuit = `s`
  this.inspire = `Draw and meld a card of any value.`
  this.echo = ``
  this.karma = [
    `If you would draw a card and have no figures of that value in hand, first say "Who is" and name a figure. Search the figures deck of that age for the named firge and take it into hand if present. Then shuffle that deck.`
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
