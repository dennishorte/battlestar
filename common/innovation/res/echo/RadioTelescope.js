const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Radio Telescope`  // Card names are unique in Innovation
  this.name = `Radio Telescope`
  this.color = `blue`
  this.age = 8
  this.expansion = `echo`
  this.biscuits = `hsss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `For every two {s} on your board, draw a {9}. Meld one of the cards drawn and return the rest. If you meld AI due to this dogma effect, you win.`
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
