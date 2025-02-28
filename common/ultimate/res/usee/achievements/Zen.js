const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Zen'
  this.name = 'Zen'
  this.shortName = 'zen'
  this.expansion = 'usee'
  this.text = 'Have a topc card on your board of value 6 or higher and no top card on your board of odd value.'
  this.alt = 'Meteorology'
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
