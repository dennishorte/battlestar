const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Monument'
  this.name = 'Monument'
  this.shortName = 'monu'
  this.expansion = 'base'
  this.text = 'Have at least four top cards with a demand effect.'
  this.alt = 'Masonry'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const topDemands = game
      .getTopCards(player)
      .filter(c => c.checkHasDemand())

    const targetCount = reduceCost ? 3 : 4
    return topDemands.length >= targetCount
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
