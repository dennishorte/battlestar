module.exports = {
  id: `Martin Scorsese`,  // Card names are unique in Innovation
  name: `Martin Scorsese`,
  color: `purple`,
  age: 10,
  expansion: `figs`,
  biscuits: `fha&`,
  dogmaBiscuit: `f`,
  karma: [
    `If you would meld a figure, instead tuck the figure and claim a standard achievement, regardless of eligibility.`
  ],
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player, { card }) => card.checkIsFigure(),
      func: (game, player, { card }) => {
        game.actions.tuck(player, card)
        const choices = game
          .getZoneById('achievements')
          .cards()
          .filter(card => !card.isSpecialAchievement)
        const formatted = game.formatAchievements(choices)
        const selected = game.actions.choose(player, formatted)[0]
        if (selected) {
          game.aAchieveAction(player, selected, { nonAction: true })
        }
        else {
          game.log.add({ template: 'There are no available standard achievements', })
        }
      }
    }
  ]
}
