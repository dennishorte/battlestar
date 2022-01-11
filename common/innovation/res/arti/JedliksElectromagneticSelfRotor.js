const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Jedlik's Electromagnetic Self-Rotor`  // Card names are unique in Innovation
  this.name = `Jedlik's Electromagnetic Self-Rotor`
  this.color = `red`
  this.age = 7
  this.expansion = `arti`
  this.biscuits = `hiss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and score an {8}. Draw and meld an {8}. Claim an achievement of value 8 if it is available, ignoring eligibility.`
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
