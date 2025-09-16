module.exports = {
  name: `Marcha Real`,
  color: `purple`,
  age: 6,
  expansion: `arti`,
  biscuits: `llhc`,
  dogmaBiscuit: `l`,
  dogma: [
    `Reveal and return two cards from your hand. If they have the same value, draw a card of value one higher. If they have the same color, claim an achievement, ignoring elibility.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.aChooseCards(player, game.getCardsByZone(player, 'hand'), { count: 2 })

      if (cards && cards.length > 0) {
        game.aRevealMany(player, cards, { ordered: true })
        game.aReturnMany(player, cards)
      }

      if (cards && cards.length === 2) {
        if (cards[0].getAge() === cards[1].getAge()) {
          game.aDraw(player, { age: cards[0].getAge() + 1 })
        }

        if (cards[0].color === cards[1].color) {
          const choices = game.getAvailableAchievementsRaw(player)
          game.aChooseAndAchieve(player, choices)
        }
      }
    }
  ],
}
