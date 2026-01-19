import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Galley Whydah`,
  color: `red`,
  age: 5,
  expansion: `arti`,
  biscuits: `hlss`,
  dogmaBiscuit: `s`,
  dogma: [
    `I compel you to choose a color of which there are more visible cards on your board than on my board. From the borrom up, transfer all cards of that color from my board to my score pile, then from your board to my board.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const choices = game
        .util
        .colors()
        .filter(color => {
          const yours = game.zones.byPlayer(player, color).numVisibleCards()
          const mine = game.zones.byPlayer(leader, color).numVisibleCards()
          return yours > mine
        })
      const colors = game.actions.choose(player, choices, { title: 'Choose a Color' })
      if (colors && colors.length > 0) {
        // Transfer my cards to my score
        game.actions.transferMany(
          player,
          game.cards.byPlayer(leader, colors[0]).reverse(),
          game.zones.byPlayer(leader, 'score'),
          { ordered: true }

        )

        // Transfer your cards to me
        const toTransfer = game.cards.byPlayer(player, colors[0]).reverse()
        const dest = game.zones.byPlayer(leader, colors[0])
        game.actions.transferMany(player, toTransfer, dest, { ordered: true })
      }
    }
  ],
} satisfies AgeCardData
