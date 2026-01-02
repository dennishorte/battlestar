module.exports = {
  id: `Murasaki Shikibu`,  // Card names are unique in Innovation
  name: `Murasaki Shikibu`,
  color: `purple`,
  age: 3,
  expansion: `figs`,
  biscuits: `sh4p`,
  dogmaBiscuit: `s`,
  karma: [
    `You may issue a Rivaly Decree with any two figures.`,
    `If you would claim a standard achievement, instead you may junk a card from your score and then achieve the standard achievement if eligible. If you do, you may achieve the junked card if eligible.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry'
    },
    {
      trigger: 'achieve',
      kind: 'would-instead',
      matches: (game, player, { isStandard, nonAction }) => isStandard && !nonAction,
      func: (game, player, { card }) => {
        const choices = game
          .cards
          .byPlayer(player, 'score')
          .filter(card => game.checkAchievementEligibility(player, card, {
            excludeCards: [card],
          }))

        const junked = game.actions.chooseAndJunk(player, choices, { min: 0 })[0]

        if (game.checkAchievementEligibility(player, card)) {
          game.actions.claimAchievement(player, { card, isStandard: true, nonAction: true })
        }

        if (junked && game.checkAchievementEligibility(player, junked)) {
          game.actions.claimAchievement(player, { card: junked, nonAction: true })
        }
      }
    }
  ]
}
