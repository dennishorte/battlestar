import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Max Verstappen`,  // Card names are unique in Innovation
  name: `Max Verstappen`,
  color: `red`,
  age: 11,
  expansion: `figs`,
  biscuits: `tpih`,
  dogmaBiscuit: `i`,
  karma: [
    `If you would execute a dogma effect, first return any number of cards from your hand. If you do, execute that dogma effect an additional time for every card you return, then draw an {11}.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma-effect',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { effect, self }) => {
        const handCards = game.cards.byPlayer(player, 'hand')
        const returned = game.actions.chooseAndReturn(player, handCards, {
          title: 'Each card returned will repeat this dogma effect (not the whole card) an additional time.',
          min: 0,
          max: handCards.length,
        })

        for (let i = 0; i < returned.length; i++) {
          game.log.add({
            template: 'Additional execution #' + (i + 1),
          })
          effect.call(game.actions)
          if (game.state.dogmaInfo.earlyTerminate) {
            return
          }

        }

        if (returned.length > 0) {
          game.actions.draw(player, { age: game.getEffectAge(self, 11) })
        }
      }
    }
  ]
} satisfies AgeCardData
