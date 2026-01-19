import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Engineering`,
  color: `red`,
  age: 3,
  expansion: `base`,
  biscuits: `khsk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I demand you transfer all top cards with a {k} from your board to my score pile!`,
    `You may splay your red cards left.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const targets = game
        .cards.tops(player)
        .filter(card => card.checkHasBiscuit('k'))
      game.actions.transferMany(player, targets, game.zones.byPlayer(leader, 'score'))
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['red'], 'left')
    }

  ],
} satisfies AgeCardData
