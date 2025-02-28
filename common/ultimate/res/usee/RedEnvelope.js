const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Red Envelope`  // Card names are unique in Innovation
  this.name = `Red Envelope`
  this.color = `red`
  this.age = 3
  this.expansion = `usee`
  this.biscuits = `lchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a value at which you have exactly two or three cards altogether in your hand and score pile. Transfer those cards to the score pile of the player on your right.`,
    `You may score exactly two or three cards from your hand.`
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
