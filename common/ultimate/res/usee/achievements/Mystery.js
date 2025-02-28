const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Mystery'
  this.name = 'Mystery'
  this.shortName = 'myst'
  this.expansion = 'usee'
  this.text = 'Have a top card on your board of value 9 or higher and fewer than five colors on your board.'
  this.alt = 'Secret History'
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
