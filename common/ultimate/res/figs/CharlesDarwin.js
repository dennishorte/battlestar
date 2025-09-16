
module.exports = {
  id: `Charles Darwin`,  // Card names are unique in Innovation
  name: `Charles Darwin`,
  color: `blue`,
  age: 7,
  expansion: `figs`,
  biscuits: `&8hs`,
  dogmaBiscuit: `s`,
  echo: `Draw an {8}.`,
  karma: [
    `You may issue an Advancement Decree with any two figures.`,
    `If you would claim an achievement, first if no other player has as many or more achievements as you, instead you win.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 8) })
  },
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement',
    },
    {
      trigger: 'achieve',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const sorted = game
          .getPlayerAll()
          .map(player => ({ player, count: game.getAchievementsByPlayer(player).total }))
          .sort((l, r) => r.count - l.count)

        const mostCondition = sorted[0].player === player
        const exclusiveCondition = sorted[0].count > sorted[1].count

        if (mostCondition && exclusiveCondition) {
          game.youWin(player, this.name)
        }
      }
    }
  ]
}
