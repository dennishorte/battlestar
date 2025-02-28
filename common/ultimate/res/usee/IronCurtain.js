const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Iron Curtain`  // Card names are unique in Innovation
  this.name = `Iron Curtain`
  this.color = `red`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `hlil`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Unsplay each splayed color on your board. For each color you unsplay, return your top card of that color and safeguard an available standard achievement.`
  ]

  this.dogmaImpl = [
    (game, player) => {

    },
  ]
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
