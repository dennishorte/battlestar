const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Elevator`  // Card names are unique in Innovation
  this.name = `Elevator`
  this.color = `yellow`
  this.age = 7
  this.expansion = `echo`
  this.biscuits = `7&ih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = `Score your top or bottom green card.`
  this.karma = []
  this.dogma = [
    `Choose a value present in your score pile. Choose to transfer all cards of the chosen value from either all other players' hands or all their score piles to your score pile.`
  ]

  this.dogmaImpl = []
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
