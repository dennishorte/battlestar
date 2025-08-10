module.exports = {
  name: `Tomb`,
  color: `yellow`,
  age: 1,
  expansion: `usee`,
  biscuits: `chkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `Safeguard an available achievement of value 1 plus the number of achievements you have.`,
    `You may transfer the lowest available achievement to your hand. If you do, return all yellow cards and all blue cards on your board.`
  ],
  dogmaImpl: [
    (game, player) => {
      const numAchievements = game.cards.byPlayer(player, 'achievements').length
      const choices = game
        .getAvailableAchievementsRaw(player)
        .filter(card => card.age === numAchievements + 1)
        .filter(card => card.checkIsStandardAchievement())

      if (choices.length > 0) {
        game.actions.safeguard(player, choices[0])
      }
      else {
        game.log.addNoEffect()
      }
    },

    (game, player) => {
      const achievements = game.getAvailableStandardAchievements(player)

      if (achievements.length === 0) {
        game.log.addNoEffect()
        return
      }

      const lowestAchievement = game.util.lowestCards(achievements)[0]
      const transfer = game.actions.chooseYesNo(player, `Transfer an achievement of value ${lowestAchievement.getAge()} to your hand?`)

      if (transfer) {
        game.actions.transfer(player, lowestAchievement, game.zones.byPlayer(player, 'hand'))

        const yellowCards = game.cards.byPlayer(player, 'yellow')
        const blueCards = game.cards.byPlayer(player, 'blue')
        const cardsToReturn = [].concat(yellowCards, blueCards)

        game.actions.returnMany(player, cardsToReturn, { ordered: true })
      }
    }
  ],
}
