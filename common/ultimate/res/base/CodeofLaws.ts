import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Code of Laws`,
  color: `purple`,
  age: 1,
  expansion: `base`,
  biscuits: `hccl`,
  dogmaBiscuit: `c`,
  dogma: [
    `You may tuck a card from your hand of the same color as any card on your board. If you do, you may splay that color of your cards left.`
  ],
  dogmaImpl: [
    (game, player) => {
      const boardColors = game
        .cards.tops(player)
        .map(card => card.color)

      const choices = game
        .zones.byPlayer(player, 'hand')
        .cardlist()
        .filter(card => boardColors.includes(card.color))

      const tucked = game.actions.chooseAndTuck(player, choices, { min: 0, max: 1 })

      if (tucked && tucked.length > 0) {
        const color = tucked[0].color
        game.actions.chooseAndSplay(player, [color], 'left')
      }

    }
  ],
} satisfies AgeCardData
