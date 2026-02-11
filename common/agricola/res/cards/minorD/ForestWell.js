module.exports = {
  id: "forest-well-d044",
  name: "Forest Well",
  deck: "minorD",
  number: 44,
  type: "minor",
  cost: { stone: 1, food: 1 },
  vps: 1,
  prereqs: { occupations: 2 },
  category: "Food Provider",
  text: "Place 1 food on each remaining round space, up to the amount of wood in your supply. At the start of these rounds, you get the food.",
  onPlay(game, player) {
    const wood = player.wood || 0
    const currentRound = game.state.round
    let placed = 0
    for (let round = currentRound + 1; round <= 14 && placed < wood; round++) {
      game.scheduleResource(player, 'food', round, 1)
      placed++
    }
    game.log.add({
      template: '{player} schedules {amount} food from Forest Well',
      args: { player, amount: placed },
    })
  },
}
