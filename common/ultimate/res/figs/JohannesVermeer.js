module.exports = {
  id: `Johannes Vermeer`,  // Card names are unique in Innovation
  name: `Johannes Vermeer`,
  color: `purple`,
  age: 5,
  expansion: `figs`,
  biscuits: `5h*c`,
  dogmaBiscuit: `c`,
  echo: ``,
  karma: [
    `If you would claim a standard achievement, first claim an achievement of value one higher, regardless of eligibility.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'achieve',
      kind: 'would-first',
      matches: (game, player, { isStandard }) => isStandard,
      func: (game, player, { age }) => {
        const choices = game
          .getAvailableAchievementsRaw(player)
          .filter(card => card.getAge() === age + 1)
        const formatted = game.formatAchievements(choices)
        const selected = game.aChoose(player, formatted, { title: 'Choose Achievement' })
        if (selected && selected.length > 0) {
          game.aAchieveAction(player, selected[0], { nonAction: true })
        }
      }
    }
  ]
}
