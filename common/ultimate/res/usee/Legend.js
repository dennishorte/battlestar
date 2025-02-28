const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Legend`  // Card names are unique in Innovation
  this.name = `Legend`
  this.color = `purple`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `hlls`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a non-purple color. Self-execute your top card of that color. Score your top card of that color. If you do, repeat this effect with the same color if you have scored fewer than nine points due to Legend during this action.`
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
