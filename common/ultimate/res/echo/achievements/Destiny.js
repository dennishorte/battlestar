const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Destiny'
  this.name = 'Destiny'
  this.shortName = 'dest'
  this.expansion = 'echo'
  this.text = 'Have five cards forecasted'
  this.alt = 'Barometer'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const targetCount = reduceCost ? 4 : 5
    return game.getZoneByPlayer(player, 'forecast').cards().length >= targetCount
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
