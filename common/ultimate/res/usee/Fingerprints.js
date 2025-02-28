const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Fingerprints`  // Card names are unique in Innovation
  this.name = `Fingerprints`
  this.color = `yellow`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `lshl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay your red or yellow cards left.`,
    `Safeguard an available achievement of value equal to the number of splayed colors on your board. Transfer a card of that value in your hand to any board.`
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
