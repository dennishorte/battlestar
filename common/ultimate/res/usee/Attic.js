const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Attic`  // Card names are unique in Innovation
  this.name = `Attic`
  this.color = `yellow`
  this.age = 6
  this.expansion = `usee`
  this.biscuits = `fhfc`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may score or safeguard a card from your hand.`,
    `Return a card from your score pile.`,
    `Draw and score a card of value equal to a card in your score pile.`
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
