const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Invention`  // Card names are unique in Innovation
  this.name = `Invention`
  this.color = `green`
  this.age = 4
  this.expansion = `base`
  this.biscuits = `hssf`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay right any one color of your cards currently splayed left. If you do, draw and score a {4}.`,
    `If you have five colors splayed, each in any direction, claim the Wonder achievement.`
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
