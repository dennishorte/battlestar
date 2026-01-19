import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Almira, Queen of the Castle`,
  color: `purple`,
  age: 5,
  expansion: `arti`,
  biscuits: `chcc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Meld a card from your hand. If you do, claim an achievement of matching value, ignoring eligiblilty. Otherwise, junk all cards in the deck of value equal to the lowest available achievement, if there is one.`
  ],
  dogmaImpl: [
    (game, player) => {
      const card = game.actions.chooseAndMeld(player, game.cards.byPlayer(player, 'hand'))[0]
      const achievements = game.getAvailableStandardAchievements(player)

      if (card) {
        const choices = achievements.filter(c => c.getAge() === card.getAge())
        game.actions.chooseAndAchieve(player, choices)
      }

      else {
        const lowest = game.util.lowestCards(achievements)[0]
        if (lowest) {
          game.actions.junkDeck(player, lowest.getAge())
        }
      }
    },
  ],
} satisfies AgeCardData
