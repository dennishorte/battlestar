const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Wonder'
  this.name = 'Wonder'
  this.shortName = 'wond'
  this.expansion = 'base'
  this.text = 'Have five colors splayed either right, up, or aslant.'
  this.alt = 'Invention'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const numColors = reduceCost ? 4 : 5
    const splays = game
      .utilColors()
      .map(c => game.getZoneByPlayer(player, c).splay)

    const directionMatch = splays
      .filter(splay => splay === 'right' || splay === 'up' || splay === 'aslant')
      .length

    return directionMatch >= numColors
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
