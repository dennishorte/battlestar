const util = require('../../../lib/util.js')

module.exports = {
  name: `Attic`,
  color: `yellow`,
  age: 6,
  expansion: `usee`,
  biscuits: `fhfc`,
  dogmaBiscuit: `f`,
  dogma: [
    `You may score or safeguard a card from your hand.`,
    `Return a card from your score pile.`,
    `Draw and score a card of value equal to a card in your score pile.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game.cards.byPlayer(player, 'hand')
      const card = game.actions.chooseCard(player, choices, {
        title: 'Choose a card to score or safeguard',
        min: 0,
        max: 1
      })
      if (card) {
        const action = game.actions.choose(player, ['score', 'safeguard'], {
          title: 'Choose an action'
        })[0]
        if (action === 'score') {
          game.actions.score(player, card)
        }
        else {
          game.actions.safeguard(player, card)
        }
      }
    },
    (game, player) => {
      const choices = game.cards.byPlayer(player, 'score')
      game.actions.chooseAndReturn(player, choices)
    },
    (game, player) => {
      const values = game
        .cards.byPlayer(player, 'score')
        .map(c => c.getAge())
      const choices = util.array.distinct(values).sort()
      const value = game.aChooseAge(player, choices) || 0
      game.actions.drawAndScore(player, value)
    }
  ],
}
