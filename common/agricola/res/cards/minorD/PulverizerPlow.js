module.exports = {
  id: "pulverizer-plow-d019",
  name: "Pulverizer Plow",
  deck: "minorD",
  number: 19,
  type: "minor",
  cost: { wood: 2 },
  prereqs: { occupations: 1 },
  category: "Farm Planner",
  text: "Immediately after each time you use a clay accumulation space, you can pay 1 clay to plow 1 field. If you do, place that 1 clay on the accumulation space.",
  matches_onAction(game, player, actionId) {
    return actionId === 'take-clay' || actionId === 'take-clay-2'
  },
  onAction(game, player, actionId) {
    if (player.clay < 1) {
      return
    }

    const validSpaces = player.getValidPlowSpaces()
    if (validSpaces.length === 0) {
      return
    }

    const selection = game.actions.choose(player, [
      'Pay 1 clay to plow 1 field',
      'Skip',
    ], {
      title: 'Pulverizer Plow',
      min: 1,
      max: 1,
    })
    if (selection[0] !== 'Skip') {
      player.payCost({ clay: 1 })
      game.actions.plowField(player)
      // Place the clay back on the accumulation space
      const actionSpace = game.state.actionSpaces[actionId]
      if (actionSpace) {
        actionSpace.accumulated = (actionSpace.accumulated || 0) + 1
      }
      game.log.add({
        template: '{player} pays 1 clay to plow a field',
        args: { player },
      })
    }
  },
}
