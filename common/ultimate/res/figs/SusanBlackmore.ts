import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Susan Blackmore`,  // Card names are unique in Innovation
  name: `Susan Blackmore`,
  color: `blue`,
  age: 10,
  expansion: `figs`,
  biscuits: `pshs`,
  dogmaBiscuit: `s`,
  karma: [
    `If another player would not draw a card for sharing after a Dogma action, first self-execute the card activated by the Dogma action.`,
    `If you would draw a card for sharing after a Dogma action, first self-execute the card activated by the dogma action.`
  ],
  karmaImpl: [
    {
      trigger: 'no-share',
      triggerAll: true,
      kind: 'would-first',
      matches: (game, player, { owner }) => player.id !== owner.id,
      func: (game, player, { card, self, owner }) => {
        game.aSelfExecute(self, owner, card)
      }

    },
    {
      trigger: 'share',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card, self }) => {
        game.aSelfExecute(self, player, card)
      }
    }
  ]
} satisfies AgeCardData
