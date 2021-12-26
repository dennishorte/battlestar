const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Florence Nightingale`
  this.color = `yellow`
  this.age = 7
  this.biscuits = `hl*7`
  this.dogmaBiscuit = `l`
  this.inspire = `Tuck a card from your hand.`
  this.echo = ``
  this.triggers = [
    `You may issue an expansion decree with any two figures.`,
    `If an opponent's effect would transfer, return, or remove a card from your score pile, instead leave it there.`
  ]
  this.dogma = []

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
