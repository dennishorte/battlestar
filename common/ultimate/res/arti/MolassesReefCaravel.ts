import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Molasses Reef Caravel`,
  color: `green`,
  age: 4,
  expansion: `arti`,
  biscuits: `sssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `Return all cards from your hand.`,
    `Draw three {4}. Meld a green card from your hand. Junk all cards in the deck of value equal to your top green card.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.returnMany(player, game.cards.byPlayer(player, 'hand'))
    },

    (game, player, { self }) => {
      game.actions.draw(player, { age: game.getEffectAge(self, 4) })
      game.actions.draw(player, { age: game.getEffectAge(self, 4) })
      game.actions.draw(player, { age: game.getEffectAge(self, 4) })

      const greenCards = game
        .cards
        .byPlayer(player, 'hand')
        .filter(card => card.color === 'green')
      if (greenCards.length > 0) {
        game.actions.chooseAndMeld(player, greenCards)
      }

      else {
        game.log.add({
          template: '{player} has no green cards',
          args: { player }
        })
      }

      const topGreen = game
        .cards
        .top(player, 'green')

      if (topGreen) {
        game.actions.junkDeck(player, topGreen.getAge())
      }
    }
  ],
} satisfies AgeCardData
