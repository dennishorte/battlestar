import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Moylough Belt Shrine`,
  color: `yellow`,
  age: 3,
  expansion: `arti`,
  biscuits: `klhk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I compel your to reveal all cards in your hand and transfer the card of my choice to my board. If you do, junk all cards in the deck of the chosen card's value.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const cards = game.cards.byPlayer(player, 'hand')

      if (cards.length === 0) {
        game.log.add({
          template: '{player} has no cards in hand',
          args: { player }

        })
        return
      }

      game.actions.revealMany(player, cards, { ordered: true })

      const card = game.actions.chooseCard(leader, cards)
      const transferred = game.actions.transfer(player, card, game.zones.byPlayer(leader, card.color))

      if (transferred) {
        game.actions.junkDeck(player, transferred.getAge())
      }
    }
  ],
} satisfies AgeCardData
