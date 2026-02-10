module.exports = {
  id: "blackberry-farmer-e108",
  name: "Blackberry Farmer",
  deck: "occupationE",
  number: 108,
  type: "occupation",
  players: "1+",
  text: "Each time you build fences, place 1 food on each remaining round space, up to the number of fences just built. At the start of these rounds, you get the food.",
  onBuildFence(game, player, fenceCount) {
    const currentRound = game.state.round
    let placedCount = 0
    for (let round = currentRound + 1; round <= 14 && placedCount < fenceCount; round++) {
      game.scheduleResource(player, 'food', round, 1)
      placedCount++
    }
    game.log.add({
      template: '{player} schedules {count} food from Blackberry Farmer',
      args: { player, count: placedCount },
    })
  },
}
