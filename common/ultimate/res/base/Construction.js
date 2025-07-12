module.exports = {
  name: `Construction`,
  color: `red`,
  age: 2,
  expansion: `base`,
  biscuits: `khkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I demand you transfer two cards from your hand to my hand! Draw a {2}!`,
    `If you are the only player with five top cards, claim the Empire achievement.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      // Choose two cards
      game.aChooseAndTransfer(
        player,
        game.cards.byPlayer(player, 'hand'),
        game.zones.byPlayer(leader, 'hand'),
        { count: 2 }
      )

      // Draw a 2
      game.aDraw(player, { age: game.getEffectAge(self, 2) })
    },
    (game, player) => {
      const achievementAvailable = game.checkAchievementAvailable('Empire')
      const playerHasFive = game
        .getTopCards(player)
        .length === 5
      const othersHaveFive = game
        .players.all()
        .filter(p => p !== player)
        .map(p => game.getTopCards(p).length)
        .filter(count => count === 5)
        .length > 0

      if (achievementAvailable && playerHasFive && !othersHaveFive) {
        return game.aClaimAchievement(player, { name: 'Empire' })
      }
      else {
        game.log.add({ template: 'no effect' })
      }
    },
  ],
}
