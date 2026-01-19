import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Holmegaard Bows`,
  color: `red`,
  age: 1,
  expansion: `arti`,
  biscuits: `klhl`,
  dogmaBiscuit: `l`,
  dogma: [
    `I compel you to transfer the highest top card with a {k} to my hand! If you don't, junk all cards in the deck of value equal to the value of your lowest top card!`,
    `Draw a {2}`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const topCastles = game
        .cards
        .tops(player)
        .filter(card => card.checkHasBiscuit('k'))
      const highest = game.util.highestCards(topCastles)
      const transferred = game.actions.chooseAndTransfer(player, highest, game.zones.byPlayer(leader, 'hand'))

      if (transferred.length === 0) {
        const lowestCards = game.util.lowestCards(game.cards.tops(player))

        if (lowestCards.length === 0) {
          game.log.add({
            template: '{player} has no top cards'
          })
        }

        else {
          const value = lowestCards[0].getAge()
          game.actions.junkDeck(player, value)
        }
      }
    },

    (game, player, { self }) => {
      game.actions.draw(player, { age: game.getEffectAge(self, 2) })
    }
  ],
} satisfies AgeCardData
