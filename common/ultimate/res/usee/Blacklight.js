const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Blacklight`  // Card names are unique in Innovation
  this.name = `Blacklight`
  this.color = `blue`
  this.age = 8
  this.expansion = `usee`
  this.biscuits = `hfff`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose to either unsplay one color of your cards, or splay up an unsplayed color on your board and draw a {9}.`
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
