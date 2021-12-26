const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `U.S. Delcaration of Independence`
  this.color = `red`
  this.age = 6
  this.biscuits = `ccsh`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I compel you to transfer the highest card in your hand to my hand, the highest card in your score pile to my score pile, and the highest top card with a {f} from yor board to my board!`
  ]

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.triggerImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
