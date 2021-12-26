const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Confucius`
  this.color = `purple`
  this.age = 2
  this.biscuits = `hl&3`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Score an opponent's top figure of value 1.`
  this.triggers = [
    `If you would take a Dogma action and activate a card with a {k} as a featured icon, instead choose any other icon on your board as the featured icon.`
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
