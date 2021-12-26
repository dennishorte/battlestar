const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Charter of Liberties`
  this.color = `blue`
  this.age = 3
  this.biscuits = `ssck`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Tuck a card from your hand. If you do, splay left its color, then choose a splayed color on any player's board. Execute all of that color's top card's non-demand dogma effects, without sharing.`
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
