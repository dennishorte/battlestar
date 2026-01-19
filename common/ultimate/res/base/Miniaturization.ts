
import util from '../../../lib/util.js'
import type { AgeCardData } from '../../UltimateAgeCard.js'


export default {
  name: `Miniaturization`,
  color: `red`,
  age: 10,
  expansion: `base`,
  biscuits: `hsis`,
  dogmaBiscuit: `s`,
  dogma: [
    `Return a card from your hand. If you returned a {0}, draw a {0} for every different value of card in your score pile. If you return an {e}, junk all cards in the {e} deck.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const cards = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'), { min: 1, max: 1 })
      if (cards && cards.length > 0) {
        const card = cards[0]
        if (card.getAge() === game.getEffectAge(self, 10)) {
          const allAges = game
            .cards.byPlayer(player, 'score')
            .map(card => card.getAge())
          const distinctAges = util.array.distinct(allAges)
          for (let i = 0; i < distinctAges.length; i++) {
            game.actions.draw(player, { age: game.getEffectAge(self, 10) })
          }

        }
        else if (card.getAge() === game.getEffectAge(self, 11)) {
          game.actions.junkDeck(player, game.getEffectAge(self, 11))
        }
      }
    }
  ],
} satisfies AgeCardData
