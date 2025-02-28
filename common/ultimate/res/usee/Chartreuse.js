const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Chartreuse`  // Card names are unique in Innovation
  this.name = `Chartreuse`
  this.color = `yellow`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `lfhl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {5}, a {4}, a {3}, and a {2}. Meld each drawn green card and each drawn yellow card, in any order. Return the other drawn cards.`,
    `You may splay your green or yellow cards right.`
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
