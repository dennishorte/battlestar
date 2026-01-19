import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `J.P. Morgan`,  // Card names are unique in Innovation
  name: `J.P. Morgan`,
  color: `green`,
  age: 8,
  expansion: `figs`,
  biscuits: `cphc`,
  dogmaBiscuit: `c`,
  karma: [
    `You may issue a Trade Decree with any two figures.`,
    `If a player would dogma a card, first splay the color of the card up on your board.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Trade'
    },
    {
      trigger: 'dogma',
      triggerAll: true,
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card, owner }) => {
        game.actions.splay(owner, card.color, 'up')
      }

    }
  ]
} satisfies AgeCardData
