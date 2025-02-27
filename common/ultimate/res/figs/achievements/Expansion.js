const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Expansion'
  this.name = 'Expansion'
  this.shortName = 'expn'
  this.expansion = 'figs'
  this.text = 'Splay any one of your colors up.'
  this.alt = ''
  this.isSpecialAchievement = false
  this.isDecree = true
  this.decreeImpl = (game, player) => {
    game.aChooseAndSplay(player, null, 'up', { count: 1 })
  }
}


Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
