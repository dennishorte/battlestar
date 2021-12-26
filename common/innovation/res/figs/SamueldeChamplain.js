const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Samuel de Champlain`
  this.color = `green`
  this.age = 5
  this.biscuits = `c5h*`
  this.dogmaBiscuit = `c`
  this.inspire = `Return a {5} from your hand. Draw a {6}.`
  this.echo = ``
  this.triggers = [
    `If you would draw a fifth card into your hand, first claim an achievement of that card's value or below, regardless of eligibility.`
  ]
  this.dogma = []

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
