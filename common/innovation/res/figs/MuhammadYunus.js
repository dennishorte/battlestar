const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Muhammad Yunus`  // Card names are unique in Innovation
  this.name = `Muhammad Yunus`
  this.color = `green`
  this.age = 10
  this.expansion = `figs`
  this.biscuits = `c*hc`
  this.dogmaBiscuit = `c`
  this.inspire = `Draw a {0}.`
  this.echo = ``
  this.karma = [
    `If any player would take a Dogma action, first you may return a card. If you do, you have the sole majority in its featured icon until the end of the action.`
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
