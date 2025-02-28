const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Rumor`  // Card names are unique in Innovation
  this.name = `Rumor`
  this.color = `green`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `cchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a card from your score pile. If you do, draw a card of value one higher than the card you return.`,
    `Transfer a card from your hand to the hand of the player on your left.`
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
