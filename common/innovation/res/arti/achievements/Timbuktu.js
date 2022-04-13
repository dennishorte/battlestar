const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = `Timbuktu`  // Card names are unique in Innovation
  this.name = `Timbuktu`
  this.color = `green`
  this.age = 3
  this.expansion = `arti`
  this.biscuits = `sccc+h`
  this.dogmaBiscuit = `c`
  this.isSpecialAchievement = true
  this.isRelic = true
  this.inspire = ``
  this.echo = ``
  this.karma = []
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
