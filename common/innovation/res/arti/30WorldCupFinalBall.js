const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `'30 World Cup Final Ball`  // Card names are unique in Innovation
  this.name = `'30 World Cup Final Ball`
  this.color = `purple`
  this.age = 8
  this.expansion = `arti`
  this.biscuits = `llih`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to return one of your achievements!`,
    `Draw and reveal an {8}. The single player with the highest top card of the drawn card's color achieves it, ignoring eligibility. If that happens, repeat this effect.`
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
