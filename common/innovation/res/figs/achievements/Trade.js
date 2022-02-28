const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Trade'
  this.name = 'Trade'
  this.exp = 'figs'
  this.text = 'Draw and foreshadow three cards of value one higher than your highest top card.'
  this.alt = ''
  this.isSpecialAchievement = true
  this.decreeImpl = (game, player) => {
    const age = game.getHighestTopAge(player) + 1
    game.aDrawAndForeshadow(player, age)
    game.aDrawAndForeshadow(player, age)
    game.aDrawAndForeshadow(player, age)
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
