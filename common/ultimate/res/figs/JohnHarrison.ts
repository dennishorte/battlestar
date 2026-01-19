import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `John Harrison`,  // Card names are unique in Innovation
  name: `John Harrison`,
  color: `green`,
  age: 6,
  expansion: `figs`,
  biscuits: `6chp`,
  dogmaBiscuit: `c`,
  karma: [
    `You may issue a Trade Decree with any two figures.`,
    `If you would take a Draw action, first return a card from your hand. If you do, draw a card from any set of value equal to the returned card.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Trade'
    },
    {
      trigger: 'draw-action',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const returnedCard = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'), { count: 1 })[0]
        if (returnedCard) {
          const expansion = game.actions.choose(player, game.settings.expansions, {
            title: 'Choose a deck to draw from',
          })
          game.actions.draw(player, { age: returnedCard.getAge(), exp: expansion})
        }

      }
    }
  ]
} satisfies AgeCardData
