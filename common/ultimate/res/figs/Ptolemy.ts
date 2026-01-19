import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Ptolemy`,  // Card names are unique in Innovation
  name: `Ptolemy`,
  color: `green`,
  age: 2,
  expansion: `figs`,
  biscuits: `hcpc`,
  dogmaBiscuit: `c`,
  karma: [
    `You may issue a Trade Decree with any two figures.`,
    `Each top blue card on every player's board counts as a card you can activate with a Dogma action.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Trade',
    },
    {
      trigger: 'list-effects',
      func(game) {
        return game
          .players.all()
          .map(p => game.cards.top(p, 'blue'))
          .filter(card => card !== undefined)
      }

    }
  ]
} satisfies AgeCardData
