module.exports = {
  id: "drill-harrow-d017",
  name: "Drill Harrow",
  deck: "minorD",
  number: 17,
  type: "minor",
  cost: { wood: 1 },
  category: "Farm Planner",
  text: "Each time before you take an unconditional \"Sow\" action, you can pay 3 food to plow 1 field.",
  onBeforeSow(game, player) {
    if (player.food >= 3) {
      const validSpaces = player.getValidPlowSpaces()
      if (validSpaces.length > 0) {
        const selection = game.actions.choose(player, [
          game.actions.option({ id: 'plow', title: 'Pay 3 food to plow 1 field' }),
          game.actions.option({ id: 'skip', title: 'Skip' }),
        ], {
          title: 'Drill Harrow',
          min: 1,
          max: 1,
        })
        if (selection[0].id !== 'skip') {
          player.payCost({ food: 3 })
          game.actions.plowField(player)
          game.log.add({
            template: '{player} plows a field',
            args: { player },
          })
        }
      }
    }
  },
}
