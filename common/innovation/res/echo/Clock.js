const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Clock`  // Card names are unique in Innovation
  this.name = `Clock`
  this.color = `purple`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `&5hs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `You may splay your color with the most cards right.`
  this.karma = []
  this.dogma = [
    `I demand you draw and reveal three {0}, total the number of {i} on them, and then return them! Transfer all cards of that value from your hand and score pile to my score pile!`
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
