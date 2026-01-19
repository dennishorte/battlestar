import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Proverb`,
  color: `blue`,
  age: 1,
  expansion: `usee`,
  biscuits: `hckk`,
  dogmaBiscuit: `k`,
  dogma: [
    `Draw, reveal, and return a {1}. If the color of the returned card is yellow or purple, safeguard an available achievement of value equal to a card in your hand, then return all cards from your hand. Otherwise, draw two {1}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 1))
      const returned = game.actions.return(player, card)

      if (returned) {
        if (card.color === 'yellow' || card.color === 'purple') {
          const handAges = game.cards.byPlayer(player, 'hand').map(c => c.getAge())
          const maxAge = Math.max(...handAges)
          const achievement = game.getAvailableAchievementsByAge(player, maxAge)[0]

          if (achievement) {
            game.actions.safeguard(player, achievement)
          }

          game.actions.returnMany(player, game.cards.byPlayer(player, 'hand'))
        }
        else {
          game.actions.draw(player, { age: game.getEffectAge(self, 1) })
          game.actions.draw(player, { age: game.getEffectAge(self, 1) })
        }
      }
    },
  ],
} satisfies AgeCardData
