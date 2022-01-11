const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Cross of Coronado`  // Card names are unique in Innovation
  this.name = `Cross of Coronado`
  this.color = `purple`
  this.age = 4
  this.expansion = `arti`
  this.biscuits = `cchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal your hand. If you have exactly five cards and five colors in your hand, you win.`
  ]

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
