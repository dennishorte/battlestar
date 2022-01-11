const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Globalization`  // Card names are unique in Innovation
  this.name = `Globalization`
  this.color = `yellow`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `hfff`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return a top card with a {l} from your board!`,
    `Draw and score a {6}. If no player has more {l} than {f} on their board, the single player with the most points wins.`
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
