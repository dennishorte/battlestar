module.exports = {
  id: "winnowing-fan-a061",
  name: "Winnowing Fan",
  deck: "minorA",
  number: 61,
  type: "minor",
  cost: { reed: 1 },
  prereqs: { bakingImprovement: true },
  category: "Food Provider",
  text: "After the field phase of each harvest, you can use a baking improvement but only to turn exactly 1 grain into food. (This is not considered a \"Bake Bread\" action.)",
  matches_onFieldPhaseEnd(_game, player) {
    return player.grain >= 1 && player.hasBakingAbility()
  },
  onFieldPhaseEnd(game, player) {
    const imp = player.getBakingImprovement()
    if (!imp) {
      return
    }

    const foodAmount = imp.bakingConversion?.rate || 2
    const choices = [
      `Bake 1 grain for ${foodAmount} food using ${imp.name}`,
      'Skip',
    ]
    const selection = game.actions.choose(player, choices, {
      title: 'Winnowing Fan: Bake 1 grain?',
      min: 1,
      max: 1,
    })

    if (selection[0] !== 'Skip') {
      player.payCost({ grain: 1 })
      player.addResource('food', foodAmount)
      game.log.add({
        template: '{player} bakes 1 grain for {food} food',
        args: { player, food: foodAmount },
      })
    }
  },
}
