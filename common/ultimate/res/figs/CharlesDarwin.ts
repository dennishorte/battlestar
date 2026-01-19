export default {
  id: `Charles Darwin`,  // Card names are unique in Innovation
  name: `Charles Darwin`,
  color: `blue`,
  age: 7,
  expansion: `figs`,
  biscuits: `p8hs`,
  dogmaBiscuit: `s`,
  karma: [
    `You may issue an Advancement Decree with any two figures.`,
    `If you would claim an achievement, first if no other player has more achievements than you, you win. Otherwise, draw an {8}.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement',
    },
    {
      trigger: 'achieve',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { self }) => {
        const sorted = game
          .players
          .all()
          .map(player => ({ player, count: game.getAchievementsByPlayer(player).total }))
          .sort((l, r) => r.count - l.count)

        const playerCount = game.getAchievementsByPlayer(player).total
        const nobodyHasMoreCondition = sorted[0].count <= playerCount

        if (nobodyHasMoreCondition) {
          game.youWin(player, self.name)
        }
        else {
          game.actions.draw(player, { age: game.getEffectAge(self, 8) })
        }
      }
    }
  ]
}
