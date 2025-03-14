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
    const targetAge = reduceCost ? 4 : 5
    const topCardAges = game
      .getTopCards(player)
      .map(card => card.getAge())
    const topCardMaxAge = Math.max(...topCardAges)

    const targetNumSecrets = reduceCost ? 3 : 4
    const numSecrets = game
      .getCardsByZone(player, 'safe')
      .length

    return topCardMaxAge >= targetAge && numSecrets >= targetNumSecrets
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
