const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tran Huang Dao`  // Card names are unique in Innovation
  this.name = `Tran Huang Dao`
  this.color = `red`
  this.age = 3
  this.expansion = `figs`
  this.biscuits = `h&kk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = `Score a top red card of value less than 4 from anywhere.`
  this.karma = [
    `Each two {k} on your board provides one additional icon of every other type on your board.`
  ]
  this.dogma = []

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
