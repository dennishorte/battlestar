module.exports = {
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
      const cards = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'))
      if (cards && cards.length > 0) {
        const card = cards[0]
        const choices = game
          .getAvailableAchievementsRaw(player)
          .filter(ach => ach.getAge() === card.age)
        game.aChooseAndAchieve(player, choices)
      }
    }
  ],
}
