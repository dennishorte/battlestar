const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Social Network`  // Card names are unique in Innovation
  this.name = `Social Network`
  this.color = `red`
  this.age = 10
  this.expansion = `echo`
  this.biscuits = `haii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you choose an icon type! Transfer all top cards without that icon from your board to my score pile!`,
    `If you have fewer {f}, fewer {c}, and fewer {k} than each other player, you win.`
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
