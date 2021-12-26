const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Garland's Ruby Slippers`
  this.color = `purple`
  this.age = 8
  this.biscuits = `hiii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Meld an {8} from your hand. If the melded card has no effects, you win. Otherwise, execute the effects of the melded card as if they were on this card. Do not share them.`
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
