const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Corporations`
  this.color = `green`
  this.age = 8
  this.biscuits = `hffc`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I demand you transfer a top non-green card with a {f} from your board to my score pile! If you do, draw and meld an {8}!`,
    `Draw and meld and {8}`
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
