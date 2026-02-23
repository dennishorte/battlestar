module.exports = {
  id: "forest-plow-b017",
  name: "Forest Plow",
  deck: "minorB",
  number: 17,
  type: "minor",
  cost: { wood: 1 },
  category: "Farm Planner",
  text: "Each time you use a wood accumulation space, you can pay 2 wood to plow 1 field. Place the paid wood on the accumulation space (for the next visitor).",
  onAction(game, player, actionId) {
    if (game.isWoodAccumulationSpace(actionId) && player.wood >= 2) {
      const card = this
      const choices = [
        'Pay 2 wood to plow 1 field',
        'Skip',
      ]
      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Pay 2 wood to plow 1 field?`,
        min: 1,
        max: 1,
      })

      if (selection[0] !== 'Skip') {
        player.payCost({ wood: 2 })
        const actionSpace = game.state.actionSpaces[actionId]
        if (actionSpace) {
          actionSpace.accumulated += 2
        }
        game.actions.plowField(player)
        game.log.add({
          template: '{player} pays 2 wood to plow a field using {card}',
          args: { player, card: card },
        })
      }
    }
  },
}
