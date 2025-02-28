const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sniping`  // Card names are unique in Innovation
  this.name = `Sniping`
  this.color = `red`
  this.age = 6
  this.expansion = `usee`
  this.biscuits = `ffhf`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you unsplay the color on your board of my choice! Meld your bottom card of that color! Transfer your bottom non-top card of that color to my board!`
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
