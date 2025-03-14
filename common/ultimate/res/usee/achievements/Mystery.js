const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Mystery'
  this.name = 'Mystery'
  this.shortName = 'myst'
  this.expansion = 'usee'
  this.text = 'Have a top card on your board of value 9 or higher and fewer than five colors on your board.'
  this.alt = 'Secret History'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const targetAge = reduceCost ? 8 : 9
    const topCardAges = game
      .getTopCards(player)
      .map(card => card.getAge())
    const topCardMaxAge = Math.max(...topCardAges)

    const targetColors = reduceCost ? 4 : 5
    const actualColors = game.getTopCards(player).map(c => c.color).length

    return topCardMaxAge >= targetAge && actualColors < targetColors
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
