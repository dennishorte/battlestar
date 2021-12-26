const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Tale of the Shipwrecked Sailor`
  this.color = `purple`
  this.age = 1
  this.biscuits = `hkss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Choose a color. Draw a {1}. Meld a card of the chosen color from your hand. If you do, splay that color left.`
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
