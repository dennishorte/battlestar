const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Hedy Lamar`
  this.color = `green`
  this.age = 9
  this.biscuits = `i&ih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = `You may splay one color of your cards up.`
  this.triggers = [
    `You may issue a Trade Decree with any two figures.`,
    `Each special achievement is claimed with one fewer or one lower of each requirement listed for you.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.triggerImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
