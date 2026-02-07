module.exports = {
  id: "woodcraft-c058",
  name: "Woodcraft",
  deck: "minorC",
  number: 58,
  type: "minor",
  cost: {},
  prereqs: { occupations: 1 },
  category: "Food Provider",
  text: "Each time you use a wood accumulation space, if immediately afterward you have at most 5 wood in your supply, you get 1 food.",
  onAction(game, player, actionId) {
    if (actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') {
      if (player.wood <= 5) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Woodcraft',
          args: { player },
        })
      }
    }
  },
}
