const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Fight Club`  // Card names are unique in Innovation
  this.name = `Fight Club`
  this.color = `red`
  this.age = 10
  this.expansion = `usee`
  this.biscuits = `hppl`
  this.dogmaBiscuit = `p`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer one of your secrets to my achievements!`,
    `You may splay your yellow cards up.`
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
