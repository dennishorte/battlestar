const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Folklore'
  this.name = 'Folklore'
  this.shortName = 'folk'
  this.expansion = 'usee'
  this.text = 'Have a top card on your board of value 8 or higher and no {f} on your board.'
  this.alt = "April Fool's Day"
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const targetAge = reduceCost ? 7 : 8
    const topCardAges = game
      .getTopCards(player)
      .map(card => card.getAge())
    const topCardMaxAge = Math.max(...topCardAges)

    const targetFactories = reduceCost ? 1 : 0
    const numFactories = game.getBiscuitsByPlayer(player).f

    return topCardMaxAge >= targetAge && numFactories <= targetFactories
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
