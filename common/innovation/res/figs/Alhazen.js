const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Alhazen`
  this.color = `blue`
  this.age = 3
  this.biscuits = `ss&h`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Tuck a top card with a {k} from anywhere.`
  this.triggers = [
    `Each of your splayed colors counts as having a top card of value equal to the number of {s} or {k} in that color (whichever is higher) for the purpose of taking a Draw or Inspire action.`
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