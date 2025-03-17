const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Legendary'
  this.name = 'Legendary'
  this.shortName = 'lgnd'
  this.expansion = 'city'
  this.text = 'Claim this achievement immediately if you meld a city with a {<} on a color already splayed left.'
  this.isSpecialAchievement = true
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
