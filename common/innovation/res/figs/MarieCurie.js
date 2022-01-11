const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Marie Curie`  // Card names are unique in Innovation
  this.name = `Marie Curie`
  this.color = `blue`
  this.age = 8
  this.expansion = `figs`
  this.biscuits = `f&hf`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Draw a {9}.`
  this.karma = [
    `Each different value present in your score pile above 6 counts as an achievement.`
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
