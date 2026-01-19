import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Canning`,
  color: `yellow`,
  age: 6,
  expansion: `base`,
  biscuits: `hflf`,
  dogmaBiscuit: `f`,
  dogma: [
    `You may draw and tuck a {6}. If you tuck a card, score a top card without a {f} of each color on your board.`,
    `You may splay your yellow cards right.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const decision = game.actions.chooseYesNo(player, 'Draw and tuck a {6}?')
      if (decision) {
        game.actions.drawAndTuck(player, game.getEffectAge(self, 6))

        const toReturn = game
          .cards.tops(player)
          .filter(card => !card.biscuits.includes('f'))

        game.actions.scoreMany(player, toReturn)
      }

      else {
        game.log.addDoNothing(player)
      }
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['yellow'], 'right')
    },
  ],
} satisfies AgeCardData
