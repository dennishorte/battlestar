const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Alhazen`  // Card names are unique in Innovation
  this.name = `Alhazen`
  this.color = `blue`
  this.age = 3
  this.expansion = `figs`
  this.biscuits = `ss&h`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Tuck a top card with a {k} from anywhere.`
  this.karma = [
    `Each of your splayed colors counts as having a top card of value equal to the number of {s} or {k} in that color (whichever is higher) for the purpose of taking a Draw or Inspire action.`
  ]
  this.dogma = []

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
