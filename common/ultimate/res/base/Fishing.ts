import util from '../../../lib/util.js'
import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Fishing`,
  color: `green`,
  age: 0,
  expansion: `base`,
  biscuits: `rhrc`,
  dogmaBiscuit: `r`,
  dogma: [
    `Draw and meld a {z}. Reveal all hands and transfer all revealed card of that drawn card's color to your hand, and if you drew or transferred Fresh Water, draw a {1}. If you have three cards of any one color in your hand, draw a {2}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const drawnCard = game.actions.drawAndMeld(player, game.getEffectAge(self, 0))

      const toReveal = game
        .players
        .all()
        .flatMap(target => game.cards.byPlayer(target, 'hand'))
      const revealed = game.actions.revealMany(player, toReveal, { ordered: true })

      const toTransfer = revealed.filter(card => card.color === drawnCard.color)
      const transferred = game.actions.transferMany(player, toTransfer, game.zones.byPlayer(player, 'hand'))

      const allCards = [...transferred, drawnCard]
      const freshWater = allCards.find(card => card.name === 'Fresh Water')

      if (freshWater) {
        game.actions.draw(player, { age: game.getEffectAge(self, 1) })
      }

      const handCards = game.cards.byPlayer(player, 'hand')
      const colorGroups = util.array.groupBy(handCards, (card) => card.color)
      if (Object.values(colorGroups).some(group => group.length === 3)) {
        game.actions.draw(player, { age: game.getEffectAge(self, 2) })
      }
    }
  ],
} satisfies AgeCardData
