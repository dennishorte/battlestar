const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Confidence'
  this.name = 'Confidence'
  this.shortName = 'conf'
  this.expansion = 'usee'
  this.text = 'Have a top card of value 5 or higher and four or more secrets.'
  this.alt = 'Assassination'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    return false
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
