import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Witch Trial`,
  color: `red`,
  age: 5,
  expansion: `usee`,
  biscuits: `fffh`,
  dogmaBiscuit: `f`,
  dogma: [
    `I demand you draw and reveal a {5}! Return your top card of the color of the drawn card, another card of that color from your hand, and a card from your score pile! If you do, repeat this effect!`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const effectAge = game.getEffectAge(self, 5)

      while (true) {
        const drawnCard = game.actions.drawAndReveal(player, effectAge)
        const returnColor = drawnCard.color

        const topCard = game.cards.top(player, returnColor)
        if (topCard) {
          game.actions.return(player, topCard)
        }

        const handCards = game
          .cards.byPlayer(player, 'hand')
          .filter(c => c.id !== drawnCard.id)
          .filter(c => c.color === returnColor)

        const handCard = game.actions.chooseAndReturn(player, handCards)[0]
        const scoreCard = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'score'))[0]

        const cardsReturned = [topCard, handCard, scoreCard].filter(c => c)
        const didReturn = cardsReturned.length === 3

        if (didReturn) {
          game.log.add({
            template: '{player} returned a top card, hand card, and score card. Repeating the dogma effect.',
            args: { player }
          })
          continue
        }
        else {
          game.log.add({
            template: '{player} did not return all three required cards. Ending the dogma effect.',
            args: { player }
          })
          break
        }
      }
    },
  ],
} satisfies AgeCardData
