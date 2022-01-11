const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `U.S. Delcaration of Independence`  // Card names are unique in Innovation
  this.name = `U.S. Delcaration of Independence`
  this.color = `red`
  this.age = 6
  this.expansion = `arti`
  this.biscuits = `ccsh`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer the highest card in your hand to my hand, the highest card in your score pile to my score pile, and the highest top card with a {f} from yor board to my board!`
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
