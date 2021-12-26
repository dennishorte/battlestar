const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Democracy`
  this.color = `purple`
  this.age = 6
  this.biscuits = `cssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `You may return any number of cards from your hand. If you have teturned more cards than any opponent due to Democracy so far during this dogma action, draw and score an {8}.`
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