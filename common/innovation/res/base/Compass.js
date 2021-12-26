const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Compass`
  this.color = `green`
  this.age = 3
  this.biscuits = `hccl`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I demand you transfer a top non-green card with a {l} from your board to my board and then you transfer a top card without a {l} from my board to your board!`
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