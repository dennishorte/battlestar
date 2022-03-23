const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Universe'
  this.name = 'Universe'
  this.shortName = 'univ'
  this.expansion = 'base'
  this.text = 'Have five top cards of value 8+.'
  this.alt = 'Astronmy'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const targetAge = reduceCost ? 7 : 8
    const targetCount = reduceCost ? 4 : 5

    const matchCount = game
      .getTopCards(player)
      .map(card => card.getAge())
      .filter(age => age >= targetAge)
      .length

    return matchCount >= targetCount
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
