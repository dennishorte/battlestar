const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Advancement'
  this.name = 'Advancement'
  this.exp = 'figs'
  this.text = 'Draw a card of value two higher than your highest top card.'
  this.alt = ''
  this.isSpecialAchievement = true
  this.decreeImpl = (game, player) => {
    const highestAge = game.getHighestTopAge(player)
    const decreeAge = highestAge + 2
    game.aDraw(player, { age: decreeAge })
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
