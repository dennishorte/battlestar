const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Single Model 27`
  this.color = `yellow`
  this.age = 7
  this.biscuits = `hfii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Tuck a card from your hand. If you do, splay up its color, and then tuck all cards from your score pile of that color.`
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
