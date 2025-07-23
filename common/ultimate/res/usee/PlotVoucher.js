module.exports = {
  name: `Plot Voucher`,
  color: `green`,
  age: 7,
  expansion: `usee`,
  biscuits: `sslh`,
  dogmaBiscuit: `s`,
  dogma: [
    `Meld a card from your score pile. Safeguard the lowest available standard achievement. If you do, super-execute the melded card if it is your turn, or if it is not your turn self-execute it.`
  ],
  dogmaImpl: [
    (game, player) => {
      const scoreCards = game.cards.byPlayer(player, 'score')
      const melded = game.actions.chooseAndMeld(player, scoreCards)[0]

      const lowestAchievement = game.utilLowestCards(game.getAvailableStandardAchievements(player))[0]
      let safeguarded
      if (lowestAchievement) {
        safeguarded = game.actions.safeguard(player, lowestAchievement)
      }

      if (safeguarded && melded) {
        if (game.players.current().name === player.name) {
          game.aSuperExecute(player, melded)
        }
        else {
          game.aSelfExecute(player, melded)
        }
      }
    },
  ],
}
