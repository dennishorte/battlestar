const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `J.P. Morgan`  // Card names are unique in Innovation
  this.name = `J.P. Morgan`
  this.color = `green`
  this.age = 8
  this.expansion = `figs`
  this.biscuits = `c&hc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `You may splay one color of your cards up.`
  this.karma = [
    `You may issue a Trade Decree with any two figures.`,
    `Each icon in each color you have splayed up provides an additional icon of the same type.`
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
