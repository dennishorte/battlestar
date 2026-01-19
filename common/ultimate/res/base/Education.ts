import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Education`,
  color: `purple`,
  age: 3,
  expansion: `base`,
  biscuits: `sssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `You may return the highest card from your score pile. If you do, draw a card of value two higher than the highest card remaining in your score pile.`
  ],
  dogmaImpl: [
    (game, player) => {
      const returnCard = game.actions.chooseYesNo(player, 'Return the highest card from your score pile?')
      if (returnCard) {
        const highestCards = game.util.highestCards(game.cards.byPlayer(player, 'score'))
        const cards = game.actions.chooseAndReturn(player, highestCards)

        if (cards.length > 0) {
          const newHighest = game.util.highestCards(game.cards.byPlayer(player, 'score'))
          const age = newHighest.length > 0 ? newHighest[0].getAge() + 2 : 2
          game.actions.draw(player, { age })
        }

      }
      else {
        game.log.addDoNothing(player)
      }
    }
  ],
} satisfies AgeCardData
