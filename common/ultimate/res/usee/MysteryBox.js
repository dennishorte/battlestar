module.exports = {
  name: `Mystery Box`,
  color: `green`,
  age: 11,
  expansion: `usee`,
  biscuits: `hccc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Claim an available standard achievement, regardless of eligibility. Self-execute it.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game.getAvailableStandardAchievements(player)
      const achievement = game.actions.chooseCards(player, choices, {
        title: 'Choose a standard achievement to claim',
        hidden: true,
      })[0]

      if (achievement) {
        game.aClaimAchievement(player, achievement)
        game.actions.reveal(player, achievement)
        game.aSelfExecute(player, achievement)
      }
    },
  ],
}
