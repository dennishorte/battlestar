const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Monument'
  this.name = 'Monument'
  this.shortName = 'monu'
  this.expansion = 'base'
  this.text = 'Tuck or score six cards in one turn.'
  this.alt = 'Masonry'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const counts = game.state.monument[player.name] || {}
    const targetCount = reduceCost ? 5 : 6
    return counts.score >= targetCount || counts.tuck >= targetCount
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
