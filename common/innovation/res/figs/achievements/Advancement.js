const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'Advancement'
  this.name = 'Advancement'
  this.exp = 'figs'
  this.text = 'Draw a card of value two higher than your highest top card.'
  this.alt = ''
  this.decreeImpl = [{
    dogma: 'Draw a card of value two higher than your highest top card.',
    steps: [
      {
        description: 'Draw a card of value two higher than your highest top card.',
        func(context, player) {
          const { game } = context
          const highest = game.getHighestTopCard(player)
          return game.aDraw(context, player, highest + 2)
        }
      },
    ]
  }]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
