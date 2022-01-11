const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Yi Sun-Sin`  // Card names are unique in Innovation
  this.name = `Yi Sun-Sin`
  this.color = `red`
  this.age = 4
  this.expansion = `figs`
  this.biscuits = `4hf&`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Score a top card with a {k} from anywhere.`
  this.karma = [
    `If you would score a card of a color you have splayed, instead tuck it, then draw a {3}.`
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
