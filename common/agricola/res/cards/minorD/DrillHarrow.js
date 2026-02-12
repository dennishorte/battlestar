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
          'Pay 3 food to plow 1 field',
          'Skip',
        ], {
          title: 'Drill Harrow',
          min: 1,
          max: 1,
        })
        if (selection[0] !== 'Skip') {
          player.payCost({ food: 3 })
          game.actions.plowField(player)
          game.log.add({
            template: '{player} plows a field using {card}',
            args: { player, card: this },
          })
        }
      }
    }
  },
}
