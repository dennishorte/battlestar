module.exports = {
  id: "sheep-well-d045",
  name: "Sheep Well",
  deck: "minorD",
  number: 45,
  type: "minor",
  cost: { stone: 2 },
  vps: 2,
  category: "Food Provider",
  text: "Place 1 food on each of the next round spaces, up to the number of sheep you have. At the start of these rounds, you get the food.",
  onPlay(game, player) {
    const sheep = player.getTotalAnimals('sheep')
    const currentRound = game.state.round
    let placed = 0
    for (let round = currentRound + 1; round <= 14 && placed < sheep; round++) {
      game.scheduleResource(player, 'food', round, 1)
      placed++
    }
    game.log.add({
      template: '{player} schedules {amount} food from Sheep Well',
      args: { player, amount: placed },
    })
  },
}
