const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `El Dorado`  // Card names are unique in Innovation
  this.name = `El Dorado`
  this.color = `green`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `cchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a {4}, a {2}, and a {1}. If all three cards have c, score all cards in the {4} deck. If at least two have c, splay your green and blue cards right.`
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
