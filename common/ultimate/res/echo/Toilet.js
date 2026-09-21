const util = require('../../../lib/util.js')

module.exports = {
  name: `Toilet`,
  color: `purple`,
  age: 4,
  expansion: `echo`,
  biscuits: `&lhl`,
  dogmaBiscuit: `l`,
  echo: `Draw and tuck a {4}.`,
  dogma: [
    `I demand you return a card from your score pile matching each different bonus on my board`,
    `You may return a card in your hand and draw a card of the same value.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const ages = util.array.distinct(leader.bonuses()).sort()

      const scoreCards = game.cards.byPlayer(player, 'score')

      const toReturn = []
      for (const age of ages) {
        const selected = game.actions.chooseCard(player, scoreCards, {
          title: 'Choose a card of age ' + age,
          filter: card => card.getAge() === age,
        })
        if (selected) {
          toReturn.push(selected)
        }
      }

      game.actions.returnMany(player, toReturn)
    },

    (game, player) => {
      const returned = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'), {
        title: 'Choose a card to cycle',
        min: 0,
        max: 1
      })
      if (returned.length > 0) {
        game.actions.draw(player, { age: returned[0].getAge() })
      }
    }
  ],
  echoImpl: (game, player, { self }) => {
    game.actions.drawAndTuck(player, game.getEffectAge(self, 4))
  },
}
