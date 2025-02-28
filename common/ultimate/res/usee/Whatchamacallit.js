const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Whatchamacallit`  // Card names are unique in Innovation
  this.name = `Whatchamacallit`
  this.color = `yellow`
  this.age = 10
  this.expansion = `usee`
  this.biscuits = `hlfl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `For each value, in ascending order, if that value is not a value of a top card on your board or a card in your score pile, draw and score a card of that value.`
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
