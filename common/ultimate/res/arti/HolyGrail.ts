import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Holy Grail`,
  color: `yellow`,
  age: 2,
  expansion: `arti`,
  biscuits: `lhcl`,
  dogmaBiscuit: `l`,
  dogma: [
    `Return a card from your hand. Claim an achievement of matching value ignoring eligibility.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'))
      if (cards && cards.length > 0) {
        const card = cards[0]
        const choices = game
          .getAvailableAchievements(player)
          .filter(ach => ach.getAge() === card.age)
        game.actions.chooseAndAchieve(player, choices)
      }

    }
  ],
} satisfies AgeCardData
