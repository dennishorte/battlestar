const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Astrobiology`  // Card names are unique in Innovation
  this.name = `Astrobiology`
  this.color = `blue`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `llph`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a bottom card from your board. Splay that color on your board aslant. Score all cards on your board of that color without {l}.`
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
