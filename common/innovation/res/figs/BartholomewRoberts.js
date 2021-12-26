const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Bartholomew Roberts`
  this.color = `green`
  this.age = 5
  this.biscuits = `*hc6`
  this.dogmaBiscuit = `c`
  this.inspire = `Score a top card with a {c} from anywhere.`
  this.echo = ``
  this.triggers = [
    `If you would score a card, first claim an achievement matching that card's value, ignoring the age requirement.`
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
