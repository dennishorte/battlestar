module.exports = {
  id: "steam-plow-d018",
  name: "Steam Plow",
  deck: "minorD",
  number: 18,
  type: "minor",
  cost: { wood: 1, food: 1 },
  vps: 1,
  category: "Farm Planner",
  text: "Immediately after each returning home phase, you can pay 2 wood and 1 food to use the \"Farmland\" action space without placing a person.",
  onReturnHome(game, player) {
    if (player.wood >= 2 && player.food >= 1 && player.getValidPlowSpaces().length > 0) {
      const selection = game.actions.choose(player, [
        'Pay 2 wood and 1 food to plow 1 field',
        'Skip',
      ], {
        title: 'Steam Plow',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.payCost({ wood: 2, food: 1 })
        game.actions.plowField(player)
        game.log.add({
          template: '{player} plows a field using {card}',
          args: { player, card: this },
        })
      }
    }
  },
}
