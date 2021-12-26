const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Yi Sun-Sin`
  this.color = `red`
  this.age = 4
  this.biscuits = `4hf&`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Score a top card with a {k} from anywhere.`
  this.triggers = [
    `If you would score a card of a color you have splayed, instead tuck it, then draw a {3}.`
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
