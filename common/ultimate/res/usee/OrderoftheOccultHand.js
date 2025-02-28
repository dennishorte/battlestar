const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Order of the Occult Hand`  // Card names are unique in Innovation
  this.name = `Order of the Occult Hand`
  this.color = `purple`
  this.age = 10
  this.expansion = `usee`
  this.biscuits = `hfss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have a {3} in your score pile, you lose.`,
    `If you have a {7} in your hand, you win.`,
    `Meld two cards from your hand. Score four cards from your hand. Splay your blue cards up.`
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
