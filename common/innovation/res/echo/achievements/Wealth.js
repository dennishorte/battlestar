const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Wealth'
  this.name = 'Wealth'
  this.shortName = 'wlth'
  this.expansion = 'echo'
  this.text = 'Have eight visible bonuses on your board.'
  this.alt = 'Palampore'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const targetCount = reduceCost ? 7 : 8
    return game.getBonuses(player).length >= targetCount
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
