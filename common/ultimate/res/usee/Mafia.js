const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mafia`  // Card names are unique in Innovation
  this.name = `Mafia`
  this.color = `yellow`
  this.age = 7
  this.expansion = `usee`
  this.biscuits = `fhff`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer your lowest secret to my safe!`,
    `Tuck a card from any score pile.`,
    `You may splay your red or yellow cards right.`
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
