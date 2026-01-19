import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Astrobiology`,
  color: `blue`,
  age: 11,
  expansion: `usee`,
  biscuits: `llph`,
  dogmaBiscuit: `l`,
  dogma: [
    `Return a bottom card from your board. Splay that color on your board aslant. Score all cards on your board of that color without {l}.`
  ],
  dogmaImpl: [
    (game, player) => {
      const bottomCards = game.cards.bottoms(player)
      const card = game.actions.chooseAndReturn(player, bottomCards)[0]

      if (card) {
        game.actions.splay(player, card.color, 'aslant')

        const cardsToScore = game
          .cards.byPlayer(player, card.color)
          .filter(c => !c.checkHasBiscuit('l'))

        game.actions.scoreMany(player, cardsToScore)
      }

    },
  ],
} satisfies AgeCardData
