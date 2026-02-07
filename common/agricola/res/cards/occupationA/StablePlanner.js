module.exports = {
  id: "stable-planner-a089",
  name: "Stable Planner",
  deck: "occupationA",
  number: 89,
  type: "occupation",
  players: "1+",
  text: "Add 3, 6, and 9 to the current round. You can place 1 stable on each corresponding round space. At the start of these rounds (not earlier), you can build the stable at no cost.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (const offset of [3, 6, 9]) {
      const round = currentRound + offset
      if (round <= 14) {
        if (!game.state.scheduledFreeStables) {
          game.state.scheduledFreeStables = {}
        }
        if (!game.state.scheduledFreeStables[player.name]) {
          game.state.scheduledFreeStables[player.name] = []
        }
        game.state.scheduledFreeStables[player.name].push(round)
      }
    }
    game.log.add({
      template: '{player} schedules free stables from Stable Planner',
      args: { player },
    })
  },
}
