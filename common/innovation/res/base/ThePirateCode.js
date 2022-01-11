const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `The Pirate Code`  // Card names are unique in Innovation
  this.name = `The Pirate Code`
  this.color = `red`
  this.age = 5
  this.expansion = `base`
  this.biscuits = `cfch`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer two cards of value {4} or less from your score pile to my score pile!`,
    `If any cards were transferred due to the demand, score the lowest top card with a {c} from your board.`
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
