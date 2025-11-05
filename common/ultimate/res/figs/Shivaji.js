module.exports = {
  id: `Shivaji`,  // Card names are unique in Innovation
  name: `Shivaji`,
  color: `red`,
  age: 5,
  expansion: `figs`,
  biscuits: `&ffh`,
  dogmaBiscuit: `f`,
  echo: `Transfer one of your top cards to the available achievements.`,
  karma: [
    `You may issue a War Decree with any two figures.`,
    `If an opponent would claim an achievement that you are eligible to claim, instead you achieve it.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    game.actions.chooseAndTransfer(player, game.cards.tops(player), game.getZoneById('achievements'))
  },
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'War',
    },
    {
      trigger: 'achieve',
      triggerAll: true,
      kind: 'would-instead',
      matches: (game, player, { card }) => {
        const owner = game.getPlayerByCard(this)
        return player !== owner && game.checkAchievementEligibility(owner, card)
      },
      func: (game, player, { card, owner }) => {
        game.actions.claimAchievement(owner, card)
      }
    }
  ]
}
