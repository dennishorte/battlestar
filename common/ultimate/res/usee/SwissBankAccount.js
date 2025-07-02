module.exports = {
  name: `Swiss Bank Account`,
  color: `green`,
  age: 6,
  expansion: `usee`,
  biscuits: `ccch`,
  dogmaBiscuit: `c`,
  dogma: [
    `Safeguard an available achievement of value equal to the number of cards in your score pile. If you do, score all cards in your hand of its value.`,
    `Draw a {6} for each secret in your safe.`
  ],
  dogmaImpl: [
    (game, player) => {
      const scoreCount = game.getCardsByZone(player, 'score').length
      const achievement = game
        .getAvailableStandardAchievements(player)
        .filter(a => a.age === scoreCount)[0]

      if (achievement) {
        game.aSafeguard(player, achievement)
        const cardsInHand = game
          .getCardsByZone(player, 'hand')
          .filter(c => c.age === achievement.age)
        game.aScoreMany(player, cardsInHand)
      }
    },
    (game, player, { self }) => {
      const secretCount = game.getCardsByZone(player, 'safe').length
      for (let i = 0; i < secretCount; i++) {
        game.aDraw(player, { age: game.getEffectAge(self, 6) })
      }
    }
  ],
}
