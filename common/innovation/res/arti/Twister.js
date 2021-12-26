const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Twister`
  this.color = `purple`
  this.age = 10
  this.biscuits = `hffi`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I compel you to reveal your score pile! For each color, meld a card of that color from your score pile.`
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
