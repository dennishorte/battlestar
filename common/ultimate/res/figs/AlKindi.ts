import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Al-Kindi`,  // Card names are unique in Innovation
  name: `Al-Kindi`,
  color: `purple`,
  age: 3,
  expansion: `figs`,
  biscuits: `hccp`,
  dogmaBiscuit: `c`,
  karma: [
    `If you would draw a card for sharing, first draw two cards of the same value.`,
    `If another player would draw a card for sharing, first score a card from your hand.`
  ],
  karmaImpl: [
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: (game, player, { share }) => share,
      func(game, player, { age }) {
        game.actions.draw(player, { age })
        game.actions.draw(player, { age })
        return 'would-first'
      }

    },
    {
      trigger: 'draw',
      triggerAll: true,
      kind: 'would-first',
      matches: (game, player, { owner, share }) => share && owner.id !== player.id,
      func: (game, player, { owner }) => {
        game.actions.chooseAndScore(owner, game.cards.byPlayer(owner, 'hand'))
      }
    },
  ]
} satisfies AgeCardData
