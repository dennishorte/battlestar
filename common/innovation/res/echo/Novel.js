const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Novel`  // Card names are unique in Innovation
  this.name = `Novel`
  this.color = `purple`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `h3c&`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `Draw a {3}.`
  this.karma = []
  this.dogma = [
    `Draw a {3}. You may splay your purple cards left.`,
    `If all your non-purple top cards share a common icon other than {c}, claim the Supremacy achievement.`
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
