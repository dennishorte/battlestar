const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Augustus Caesar`  // Card names are unique in Innovation
  this.name = `Augustus Caesar`
  this.color = `green`
  this.age = 2
  this.expansion = `figs`
  this.biscuits = `khk*`
  this.dogmaBiscuit = `k`
  this.inspire = `Draw and foreshadow a {3}.`
  this.echo = ``
  this.karma = [
    `If any player would meld or foreshadow a card of value less than 4, first reveal it. If it is red or green and has a {k}, instead transfer it to your board, then tuck all cards from your forecast.`
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
