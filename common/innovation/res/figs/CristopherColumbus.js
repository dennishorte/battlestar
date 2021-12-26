const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Cristopher Columbus`
  this.color = `green`
  this.age = 4
  this.biscuits = `4lh*`
  this.dogmaBiscuit = `l`
  this.inspire = `Draw a {4}.`
  this.echo = ``
  this.triggers = [
    `You may issue a Trade Decree with any two figures.`,
    `Each {f} on your board provides two additional {c}.`
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
