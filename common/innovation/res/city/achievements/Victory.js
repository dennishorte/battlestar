const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Victory'
  this.name = 'Victory'
  this.shortName = 'vcty'
  this.expansion = 'city'
  this.text = 'Claim this achievement immediately if you tuck a city with a {:}.'
  this.isSpecialAchievement = true
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
