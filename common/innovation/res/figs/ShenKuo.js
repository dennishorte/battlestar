const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Shen Kuo`  // Card names are unique in Innovation
  this.name = `Shen Kuo`
  this.color = `green`
  this.age = 3
  this.expansion = `figs`
  this.biscuits = `ch*c`
  this.dogmaBiscuit = `c`
  this.inspire = `You may splay one color of your cards left.`
  this.echo = ``
  this.karma = [
    `Each splayed color on your board provides three additional points towards your score.`
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
