const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Attic`  // Card names are unique in Innovation
  this.name = `Attic`
  this.color = `yellow`
  this.age = 6
  this.expansion = `usee`
  this.biscuits = `fhfc`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may score or safeguard a card from your hand.`,
    `Return a card from your score pile.`,
    `Draw and score a card of value equal to a card in your score pile.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game.getCardsByZone(player, 'hand')
      const card = game.aChooseCard(player, choices, {
        title: 'Choose a card to score or safeguard',
        min: 0,
        max: 1
      })
      if (card) {
        const action = game.aChoose(player, ['score', 'safeguard'], {
          title: 'Choose an action'
        })[0]
        if (action === 'score') {
          game.aScore(player, card)
        }
        else {
          game.aSafeguard(player, card)
        }
      }
    },
    (game, player) => {
      const choices = game.getCardsByZone(player, 'score')
      game.aChooseAndReturn(player, choices)
    },
    (game, player) => {
      const values = game
        .getCardsByZone(player, 'score')
        .map(c => c.getAge())
      const choices = util.array.distinct(values).sort()
      const value = game.aChooseAge(player, choices) || 0
      game.aDrawAndScore(player, value)
    }
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
