const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Quackery`  // Card names are unique in Innovation
  this.name = `Quackery`
  this.color = `blue`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `hsfs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose to either score a card from your hand, or draw a {4}.`,
    `Return exactly two cards in your hand. If you do, draw a card of value equal to the sum number of {f} and {l} on the returned cards.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = ['Score a card', 'Draw a 4']
      const choice = game.aChooseOne(player, choices, { title: 'Choose an option:' })

      if (choice === 'Score a card') {
        game.aChooseAndScore(player, game.getCardsByZone(player, 'hand'))
      } else if (choice === 'Draw a 4') {
        game.aDraw(player, { age: game.getEffectAge(this, 4) })
      }
    },
    (game, player) => {
      const returned = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'), {
        count: 2,
        exact: true,
      })

      if (returned.length === 2) {
        const leafCount = returned.reduce((total, card) => total + card.biscuits.filter(b => b === 'l').length, 0)
        const factoryCount = returned.reduce((total, card) => total + card.biscuits.filter(b => b === 'f').length, 0)
        const drawAge = leafCount + factoryCount

        game.aDraw(player, { age: drawAge })
      }
    }
  ]
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card