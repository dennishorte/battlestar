const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Glory'
  this.name = 'Glory'
  this.shortName = 'glry'
  this.expansion = 'city'
  this.text = 'Claim this achievement immediately if you junk a city with a {;}.'
  this.isSpecialAchievement = true
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
