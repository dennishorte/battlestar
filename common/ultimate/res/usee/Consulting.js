const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Consulting`  // Card names are unique in Innovation
  this.name = `Consulting`
  this.color = `blue`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `hffc`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose an opponent. Draw and meld two {9}. Self-execute the top card on your board of that player's choice.`
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
