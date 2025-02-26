const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'World'
  this.name = 'World'
  this.shortName = 'wrld'
  this.expansion = 'base'
  this.text = 'Have twelve {i} on your board.'
  this.alt = 'Translation'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const targetInfo = reduceCost ? 11 : 12
    return game.getBiscuitsByPlayer(player).i >= targetInfo
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
