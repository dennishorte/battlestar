const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Holography`  // Card names are unique in Innovation
  this.name = `Holography`
  this.color = `purple`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `pphp`
  this.dogmaBiscuit = `p`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose red, blue, or green. Score all but your top two cards of that color, then splay it aslant. If you do both, exchange all the lowest cards in your score pile with all your claimed standard achievements of lower value.`
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
