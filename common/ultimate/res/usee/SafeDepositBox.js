const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Safe Deposit Box`  // Card names are unique in Innovation
  this.name = `Safe Deposit Box`
  this.color = `red`
  this.age = 7
  this.expansion = `usee`
  this.biscuits = `hcic`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may choose to either draw and junk two {7}, or exchange all cards in your score pile with all valued cards in the junk.`
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
