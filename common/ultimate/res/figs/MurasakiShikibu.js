module.exports = {
  id: `Murasaki Shikibu`,  // Card names are unique in Innovation
  name: `Murasaki Shikibu`,
  color: `purple`,
  age: 3,
  expansion: `figs`,
  biscuits: `sh4*`,
  dogmaBiscuit: `s`,
  echo: ``,
  karma: [
    `You may issue a Rivaly Decree with any two figures.`,
    `If you would claim a standard achievement, instead achieve a card of equal value from your score pile. Then claim the achievement, if you are still eligible.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry'
    },
    {
      trigger: 'achieve',
      kind: 'would-instead',
      matches: (game, player, { isStandard }) => isStandard,
      func: (game, player, { card }) => {
        const choices = game
          .getCardsByZone(player, 'score')
          .filter(other => other.getAge() === card.getAge())
        const selected = game.actions.chooseCard(player, choices)
        if (selected) {
          game.aClaimAchievement(player, { card: selected })
        }

        if (game.checkAchievementEligibility(player, card)) {
          game.aClaimAchievement(player, { card })
        }
      }
    }
  ]
}
