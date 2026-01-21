module.exports = {
  name: `Artificial Heart`,
  color: `blue`,
  age: 10,
  expansion: `echo`,
  biscuits: `hllb`,
  dogmaBiscuit: `l`,
  echo: [],
  dogma: [
    `Claim one available standard achievement, if eligible, doubling your current score for the purposes of eligibility. If you do, and Artificial Heart was foreseen, repeat this effect.`,
  ],
  dogmaImpl: [
    (game, player, { foreseen, self }) => {
      game.log.addForeseen(foreseen, self)
      while (true) {
        const choices = player.eligibleAchievementsRaw({ doubleScore: true })
        const achieved = game.actions.chooseAndAchieve(player, choices)

        if (!foreseen || achieved.length === 0) {
          break
        }
      }
    }
  ],
  echoImpl: [],
}
