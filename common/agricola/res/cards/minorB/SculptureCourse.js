module.exports = {
  id: "sculpture-course-b053",
  name: "Sculpture Course",
  deck: "minorB",
  number: 53,
  type: "minor",
  cost: { grain: 1 },
  category: "Food Provider",
  text: "At the end of each round that does not end with a harvest, you can use this card to exchange either 1 wood for 2 food, or 1 stone for 4 food.",
  onRoundEnd(game, player, round) {
    if (!game.isHarvestRound(round) && (player.wood >= 1 || player.stone >= 1)) {
      const card = this
      const choices = []
      if (player.wood >= 1) {
        choices.push('1 wood \u2192 2 food')
      }
      if (player.stone >= 1) {
        choices.push('1 stone \u2192 4 food')
      }
      choices.push('Skip')

      if (choices.length === 1) {
        return
      }

      const selection = game.actions.choose(player, choices, {
        title: 'Sculpture Course: Choose an exchange',
        min: 1,
        max: 1,
      })
      const sel = Array.isArray(selection) ? selection[0] : selection

      if (sel === '1 wood \u2192 2 food') {
        player.removeResource('wood', 1)
        player.addResource('food', 2)
        game.log.add({
          template: '{player} uses {card} to exchange 1 wood for 2 food',
          args: { player, card },
        })
      }
      else if (sel === '1 stone \u2192 4 food') {
        player.removeResource('stone', 1)
        player.addResource('food', 4)
        game.log.add({
          template: '{player} uses {card} to exchange 1 stone for 4 food',
          args: { player, card },
        })
      }
    }
  },
}
