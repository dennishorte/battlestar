import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Knots`,
  color: `blue`,
  age: 0,
  expansion: `base`,
  biscuits: `lhss`,
  dogmaBiscuit: `s`,
  dogma: [
    `Reveal a card in your score pile of a color on your board. If you do, draw a {1}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const choices = game
        .cards
        .byPlayer(player, 'score')
        .filter(card => Boolean(game.cards.top(player, card.color)))

      const revealed = game.actions.chooseAndReveal(player, choices)[0]

      if (revealed) {
        game.actions.draw(player, { age: game.getEffectAge(self, 1) })
      }

    }
  ],
} satisfies AgeCardData
