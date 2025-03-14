const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Anonymity'
  this.name = 'Anonymity'
  this.shortName = 'anon'
  this.expansion = 'usee'
  this.text = 'Have a top card on your board of vaue 7 or higher and no standard achievements.'
  this.alt = 'Masquerade'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const age = reduceCost ? 6 : 7
    const numAchievements = reduceCost ? 1 : 0

    const topCardAges = game
      .getTopCards(player)
      .map(card => card.getAge())

    const topCardMaxAge = Math.max(topCardAges)

    const numStandardAchievements = game
      .getCardsByZone(player, 'achievements')
      .filter(card => card.checkIsStandardAchievement())
      .length

    return topCardMaxAge >= age && numStandardAchievements <= numAchievements
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
