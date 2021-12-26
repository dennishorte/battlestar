const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Globalization`
  this.color = `yellow`
  this.age = 10
  this.biscuits = `hfff`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I demand you return a top card with a {l} from your board!`,
    `Draw and score a {6}. If no player has more {l} than {f} on their board, the single player with the most points wins.`
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
