import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Sibidu Needle`,
  color: `blue`,
  age: 1,
  expansion: `arti`,
  biscuits: `kkkh`,
  dogmaBiscuit: `k`,
  dogma: [
    `Draw and reveal a {1}. If you have a top card of matching color and value to the drawn card, score the drawn card and repeat this effect.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      while (true) {
        const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 1))
        if (card) {
          const top = game.cards.top(player, card.color)
          if (top && top.getAge() === card.getAge()) {
            game.actions.score(player, card)
          }

          else {
            break
          }
        }
      }
    }
  ],
} satisfies AgeCardData
