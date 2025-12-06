module.exports = {
  id: `Shivaji`,  // Card names are unique in Innovation
  name: `Shivaji`,
  color: `red`,
  age: 5,
  expansion: `figs`,
  biscuits: `pffh`,
  dogmaBiscuit: `f`,
  karma: [
    `If an opponent would claim an achievement, first you claim another available standard achievement if eligible.`,
    `If you would dogma a yellow card, first transfer all purple cards on your board to the available achievements.`
  ],
  karmaImpl: [
    {
      trigger: 'achieve',
      triggerAll: true,
      kind: 'would-first',
      matches: (game, player, { owner }) => player.id !== owner.id,
      func: (game, player, { card, owner }) => {
        const choices = game
          .getAvailableStandardAchievements(owner)
          .filter(achievement => game.checkAchievementEligibility(owner, achievement))
          .filter(achievement => achievement.id !== card.id)

        game.actions.chooseAndAchieve(owner, choices)
      }
    },
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: (game, player, { card }) => card.color === 'yellow',
      func: (game, player) => {
        const toTransfer = game.cards.byPlayer(player, 'purple')
        game.actions.transferMany(player, toTransfer, game.zones.byId('achievements'), { ordered: true })
      }
    }
  ]
}
