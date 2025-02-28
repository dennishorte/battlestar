const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Handbag`  // Card names are unique in Innovation
  this.name = `Handbag`
  this.color = `green`
  this.age = 8
  this.expansion = `usee`
  this.biscuits = `hcic`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may choose to either transfer your bottom card of each color to your hand, or tuck all cards from your score pile, or choose a value and score all cards from your hand of that value.`
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
