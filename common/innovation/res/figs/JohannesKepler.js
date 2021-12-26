const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Johannes Kepler`
  this.color = `blue`
  this.age = 4
  this.biscuits = `hs&s`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw a {5}.`
  this.triggers = [
    `If you would take a Dogma actions, first reveal all cards of the chosen card's color from your hand. Increase each {} value in any effect during this action by the number of cards you revealed.`
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
