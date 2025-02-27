const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Empire'
  this.name = 'Empire'
  this.shortName = 'empr'
  this.expansion = 'base'
  this.text = 'Have three biscuits of each of the six non-person biscuit types.'
  this.alt = 'Construction'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const biscuits = game.getBiscuitsByPlayer(player)
    delete biscuits['p']
    const targetCount = reduceCost ? 2 : 3
    const targetBiscuitCount = reduceCost ? 5 : 6
    const numMatches = Object.values(biscuits).filter(count => count >= targetCount).length
    return numMatches >= targetBiscuitCount
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
