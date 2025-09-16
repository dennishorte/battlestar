module.exports = {
  id: `Martin Scorsese`,  // Card names are unique in Innovation
  name: `Martin Scorsese`,
  color: `purple`,
  age: 10,
  expansion: `figs`,
  biscuits: `fha&`,
  dogmaBiscuit: `f`,
  echo: `Draw and meld a {0}.`,
  karma: [
    `If you would meld a figure, instead tuck the figure and claim a standard achievement, regardless of eligibility.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    game.aDrawAndMeld(player, game.getEffectAge(this, 10))
  },
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player, { card }) => card.checkIsFigure(),
      func: (game, player, { card }) => {
        game.aTuck(player, card)
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
