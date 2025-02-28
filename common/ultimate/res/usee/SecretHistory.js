const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Secret History`  // Card names are unique in Innovation
  this.name = `Secret History`
  this.color = `green`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `fcfh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer one of your secrets to my safe!`,
    `If your red and purple cards are splayed right, claim the Mystery achievement. Otherwise, splay your red or purple cards right.`
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
