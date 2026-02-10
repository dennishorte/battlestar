module.exports = {
  id: "syrup-tap-e047",
  name: "Syrup Tap",
  deck: "minorE",
  number: 47,
  type: "minor",
  cost: { wood: 1, stone: 1 },
  vps: 1,
  text: "Each time you get at least 1 wood from an action space, place 1 food on the next round space. At the start of that round, you get the food.",
  onAction(game, player, actionId, resources) {
    if (resources && resources.wood > 0) {
      const nextRound = game.state.round + 1
      game.scheduleResource(player, 'food', nextRound, 1)
    }
  },
}
