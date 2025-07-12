module.exports = {
  name: `Cabal`,
  color: `red`,
  age: 5,
  expansion: `usee`,
  biscuits: `hffc`,
  dogmaBiscuit: `f`,
  dogma: [
    `I demand you transfer all cards from your hand that have a value matching any of my secrets to my score pile! Draw a {5}!`,
    `Safeguard an available achievement of value equal to a top card on your board.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const leaderSecretAges = game
        .getCardsByZone(leader, 'safe')
        .map(card => card.getAge())

      const handCards = game
        .getCardsByZone(player, 'hand')
        .filter(card => leaderSecretAges.includes(card.getAge()))

      game.aTransferMany(player, handCards, game.zones.byPlayer(leader, 'score'))

      game.aDraw(player, { age: game.getEffectAge(self, 5) })
    },

    (game, player) => {
      const topCardAges = game
        .getTopCards(player)
        .map(card => card.getAge())

      const availableAchievements = game
        .getAvailableAchievementsRaw(player)
        .filter(achievement => topCardAges.includes(achievement.getAge()))

      game.aChooseAndSafeguard(player, availableAchievements, { hidden: true })
    }
  ],
}
