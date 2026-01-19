export default {
  id: `Avicenna`,  // Card names are unique in Innovation
  name: `Avicenna`,
  color: `yellow`,
  age: 3,
  expansion: `figs`,
  biscuits: `plhl`,
  dogmaBiscuit: `l`,
  karma: [
    `You may issue an Expansion Decree with any two figures.`,
    `If you would dogma a card as your first action, instead junk the lowest available standard achievement, then super-execute the junked card.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Expansion',
    },
    {
      trigger: 'dogma',
      kind: 'would-instead',
      matches: (game) => game.state.actionNumber === 1,
      func: (game, player, { self }) => {
        const availableAchievements = game.getAvailableStandardAchievements(player)
        if (availableAchievements.length === 0) {
          game.log.add({
            template: 'There are no available standard achievements',
          })
          return
        }

        const lowest = availableAchievements.sort((l, r) => l.getAge() - r.getAge())[0].getAge()
        const junked = game.actions.junkAvailableAchievement(player, lowest)

        game.aSuperExecute(self, player, junked)
      }
    }
  ]
}
