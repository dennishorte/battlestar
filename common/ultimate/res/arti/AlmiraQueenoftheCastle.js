module.exports = {
  name: `Almira, Queen of the Castle`,
  color: `purple`,
  age: 5,
  expansion: `arti`,
  biscuits: `chcc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Meld a card from your hand. Claim an achievement of matching value, ignoring eligiblilty.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.aChooseAndMeld(player, game.getCardsByZone(player, 'hand'))
      if (cards && cards.length > 0) {
        const achievements = game
          .getAvailableAchievementsRaw(player)
          .filter(card => card.getAge() === cards[0].getAge())
        game.aChooseAndAchieve(player, achievements)
      }
    },
  ],
}
