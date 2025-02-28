const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Witch Trial`  // Card names are unique in Innovation
  this.name = `Witch Trial`
  this.color = `red`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `fffh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw and reveal a {5}! Return your top card of the color of the drawn card, another card of that color from your hand, and a card from your score pile! If you do, repeat this effect!`
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
