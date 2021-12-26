const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Metric System`
  this.color = `green`
  this.age = 6
  this.biscuits = `hfcc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `If your green cards are splayed right, you may splay any one color of your cards right.`,
    `You may splay your green cards right.`
  ]

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
