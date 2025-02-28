const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Exile`  // Card names are unique in Innovation
  this.name = `Exile`
  this.color = `yellow`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `lhlk`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return a top card without [c] from your board! Return all cards of the returned card's value from your score pile!`,
    `If exactly one card was returned due to the demand, return Exile if it is a top card on any board and draw a [3].`
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
