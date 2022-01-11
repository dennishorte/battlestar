const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Time`  // Card names are unique in Innovation
  this.name = `Time`
  this.color = `yellow`
  this.age = 8
  this.expansion = `arti`
  this.biscuits = `hiis`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer a non-yellow card with a {i} from your board to my board! If you do, repeat this effect!`
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
