module.exports = {
  name: `Artificial Heart`,
  color: `blue`,
  age: 10,
  expansion: `echo`,
  biscuits: `hllb`,
  dogmaBiscuit: `l`,
  echo: [],
  dogma: [
    `Claim a standard achievement, if eligible. Your current score is doubled for the purpose of checking eligibility.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .getEligibleAchievementsRaw(player, { doubleScore: true })
        .filter(card => card.zone === 'achievements')

      game.aChooseAndAchieve(player, choices)
    }
  ],
  echoImpl: [],
}
