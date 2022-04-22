const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Indian Clubs`  // Card names are unique in Innovation
  this.name = `Indian Clubs`
  this.color = `purple`
  this.age = 6
  this.expansion = `echo`
  this.biscuits = `hl6l`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return two cards from your score pile!`,
    `For every value of card you have in your score pile, score a card from your hand of that value.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aChooseAndReturn(player, game.getCardsByZone(player, 'score'), { count: 2 })
    },

    (game, player) => {
      const values = game
        .getCardsByZone(player, 'score')
        .map(card => card.getAge())
      const cards = game
        .getCardsByZone(player, 'hand')
        .filter(card => values.includes(card.getAge()))

      const choices = util.array.groupBy(cards, card => card.getAge())
      const toScore = []

      for (const [age, cards] of Object.entries(choices)) {
        if (cards.length === 1) {
          toScore.push(cards[0])
        }
        else {
          const card = game.aChooseCard(player, cards, { title: `Choose a card to score of age ${age}` })
          toScore.push(card)
        }
      }

      game.aScoreMany(player, toScore)
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
