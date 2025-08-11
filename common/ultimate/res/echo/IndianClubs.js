
const util = require('../../../lib/util.js')

module.exports = {
  name: `Indian Clubs`,
  color: `purple`,
  age: 6,
  expansion: `echo`,
  biscuits: `hl6l`,
  dogmaBiscuit: `l`,
  echo: [],
  dogma: [
    `I demand you return two cards from your score pile!`,
    `For every value of card you have in your score pile, score a card from your hand of that value.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'score'), { count: 2 })
    },

    (game, player) => {
      const values = game
        .cards.byPlayer(player, 'score')
        .map(card => card.getAge())
      const cards = game
        .cards.byPlayer(player, 'hand')
        .filter(card => values.includes(card.getAge()))

      const choices = util.array.groupBy(cards, card => card.getAge())
      const toScore = []

      for (const [age, cards] of Object.entries(choices)) {
        if (cards.length === 1) {
          toScore.push(cards[0])
        }
        else {
          const card = game.actions.chooseCard(player, cards, { title: `Choose a card to score of age ${age}` })
          toScore.push(card)
        }
      }

      game.aScoreMany(player, toScore)
    }
  ],
  echoImpl: [],
}
