const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Fashion Mask`  // Card names are unique in Innovation
  this.name = `Fashion Mask`
  this.color = `yellow`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `hlll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Tuck a top card with {l} or {p} of each color on your board. You may safeguard one of the tucked cards.`,
    `Score all but the top five each of your yellow and purple cards. Splay those colors aslant.`
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
