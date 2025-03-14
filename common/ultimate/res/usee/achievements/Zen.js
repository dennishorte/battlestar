const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Zen'
  this.name = 'Zen'
  this.shortName = 'zen'
  this.expansion = 'usee'
  this.text = 'Have a top card on your board of value 6 or higher and no top card on your board of odd value.'
  this.alt = 'Meteorology'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const targetAge = reduceCost ? 5 : 6
    const topCardAges = game
      .getTopCards(player)
      .map(card => card.getAge())
    const topCardMaxAge = Math.max(...topCardAges)

    const targetOdd = reduceCost ? 1 : 0
    const numOdd = game
      .getTopCards(player)
      .filter(card => card.getAge() % 2 === 1)
      .length

    return topCardMaxAge >= targetAge && numOdd <= targetOdd
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
