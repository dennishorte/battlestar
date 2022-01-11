const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Moonlight Sonata`  // Card names are unique in Innovation
  this.name = `Moonlight Sonata`
  this.color = `purple`
  this.age = 6
  this.expansion = `arti`
  this.biscuits = `sshs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a color on your board having the highest top card. meld the bottom card on your board of that color. Claim an achievement, ignoring eligibility.`
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
