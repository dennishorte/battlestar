const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'War'
  this.name = 'War'
  this.exp = 'figs'
  this.text = ''
  this.alt = ''
  this.decreeImpl = [{
    dogma: '',
    steps: [
      {
        description: 'Draw a card of value two higher than your highest top card.',
        func(context, player) {
          const { game } = context
          return game.aChooseAndSplay(context, {
          })
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
