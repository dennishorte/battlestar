const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Sun Tzu`
  this.color = `red`
  this.age = 2
  this.biscuits = `*khk`
  this.dogmaBiscuit = `k`
  this.inspire = `Draw a {2}.`
  this.echo = ``
  this.triggers = [
    `You may issue a War Decree with any two figures.`,
    `If you would draw for a share bonus, first meld any number of cards from your hand matching the Dogma action's featured icon.`
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
