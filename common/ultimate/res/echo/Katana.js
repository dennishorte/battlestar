module.exports = {
  name: `Katana`,
  color: `red`,
  age: 3,
  expansion: `echo`,
  biscuits: `kkhk`,
  dogmaBiscuit: `k`,
  echo: ``,
  dogma: [
    `I demand you transfer two top cards with a {k} from your board to my score pile! If you transfered exactly one, and Katana was foreseen, junk all available standard achievements.`,
  ],
  dogmaImpl: [
    (game, player, { leader, foreseen, self }) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('k'))
      const transferred = game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(leader, 'score'), { count: 2 })

      if (transferred && transferred.length === 1 && foreseen) {
        game.mLogWasForeseen(self)
        const achievements = game.getAvailableStandardAchievements(player)
        game.aJunkMany(player, achievements, { ordered: true })
      }
    }
  ],
  echoImpl: [],
}
