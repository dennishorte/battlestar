const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `John Von Neumann`  // Card names are unique in Innovation
  this.name = `John Von Neumann`
  this.color = `red`
  this.age = 8
  this.expansion = `figs`
  this.biscuits = `hii&`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = `Draw and reveal two {9}. If either is purple, return them.`
  this.karma = [
    `When you meld this card, return all opponents' top figures.`,
    `Each card in your hand provides two additional {i}.`
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
