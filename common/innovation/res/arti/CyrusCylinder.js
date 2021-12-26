const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Cyrus Cylinder`
  this.color = `purple`
  this.age = 2
  this.biscuits = `hssk`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Choose any other rtop purple card on any plyaer's board. Execute its non-demand dogma effects. Do not share them. Splay left a color on any player's board.`
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
