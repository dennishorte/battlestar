const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Margaret Thatcher`  // Card names are unique in Innovation
  this.name = `Margaret Thatcher`
  this.color = `red`
  this.age = 10
  this.expansion = `figs`
  this.biscuits = `ff&h`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Score a top card with a {f} or {c}.`
  this.karma = [
    `If you would take a Dogma action, first score any top card with a {c} or {f} from anywhere.`
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
