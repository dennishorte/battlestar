import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Yeager's Bell X-1A`,
  color: `blue`,
  age: 9,
  expansion: `arti`,
  biscuits: `iifh`,
  dogmaBiscuit: `i`,
  dogma: [
    `Draw and meld a {9}, and self-execute it. If that card has a {i}, repeat this effect.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      while (true) {
        const card = game.actions.drawAndMeld(player, game.getEffectAge(self, 9))
        if (card) {
          game.aSelfExecute(self, player, card)

          if (card.checkHasBiscuit('i')) {
            game.log.add({ template: 'Card had an {i}.' })
            continue
          }

          else {
            game.log.add({ template: 'Card did not have an {i}.' })
            break
          }
        }
      }
    }
  ],
} satisfies AgeCardData
