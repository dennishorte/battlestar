import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Feudalism`,
  color: `purple`,
  age: 3,
  expansion: `base`,
  biscuits: `hklk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I demand you transfer a card with a {k} from your hand to my hand! If you do, unsplay that color of your cards!`,
    `You may splay your yellow or purple cards left.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const choices = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.checkHasBiscuit('k'))
      const cards = game.actions.chooseAndTransfer(player, choices, game.zones.byPlayer(leader, 'hand'))
      if (cards && cards.length > 0) {
        const card = cards[0]
        game.actions.unsplay(player, card.color)
      }

    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['yellow', 'purple'], 'left')
    }
  ],
} satisfies AgeCardData
