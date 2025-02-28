const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Popular Science`  // Card names are unique in Innovation
  this.name = `Popular Science`
  this.color = `blue`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `scsh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a card of value equal to the value of a top green card anywhere.`,
    `Draw and meld a card of value one higher than the value of your top yellow card.`,
    `You may splay your blue cards right.`
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
