const util = require('../../../lib/util.js')

module.exports = {
  id: `Carl Friedrich Gauss`,  // Card names are unique in Innovation
  name: `Carl Friedrich Gauss`,
  color: `blue`,
  age: 6,
  expansion: `figs`,
  biscuits: `ssph`,
  dogmaBiscuit: `s`,
  karma: [
    `If you would meld a card, first choose a value and meld all other cards of that value from your hand and score pile.`,
    `If you would take a Draw action, first draw a {7}.`,
  ],
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: () => true,
      func(game, player, { card }) {
        const age = game.actions.chooseAge(player)

        // Use distinct in case some Karma causes overlap in these two zones.
        const cards = util.array.distinct([
          ...game.cards.byPlayer(player, 'hand'),
          ...game.cards.byPlayer(player, 'score'),
        ])

        game.actions.meldMany(player, cards, {
          filter: other => other !== card && other.getAge() === age,
        })
      }
    },
    {
      trigger: 'draw-action',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { self }) => {
        game.actions.draw(player, { age: game.getEffectAge(self, 7) })
      },
    },
  ]
}
