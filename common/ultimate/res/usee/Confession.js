const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Confession`  // Card names are unique in Innovation
  this.name = `Confession`
  this.color = `purple`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `ccch`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a top card with {f} of each color from your board. If you return none, meld a card from your score pile, then draw and score a {4}.`,
    `Draw a {4} for each {f} in your score pile.`
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
