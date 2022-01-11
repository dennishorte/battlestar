const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Along the River during the Qingming Festival`  // Card names are unique in Innovation
  this.name = `Along the River during the Qingming Festival`
  this.color = `yellow`
  this.age = 3
  this.expansion = `arti`
  this.biscuits = `ccch`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {4}. If it is yellow, tuck it. If it is purple, score it. Otherwise, repeat this effect.`
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
