const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Surveillance`  // Card names are unique in Innovation
  this.name = `Surveillance`
  this.color = `yellow`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `siih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you reveal your hand! If each color present in my hand is present in yours, and vice versa, and your hand is not empty, I win!`,
    `Draw a {10}.`
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
