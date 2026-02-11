module.exports = {
  id: "garden-claw-c047",
  name: "Garden Claw",
  deck: "minorC",
  number: 47,
  type: "minor",
  cost: { wood: 1 },
  category: "Food Provider",
  text: "Place 1 food on each remaining round space, up to three times the number of planted fields you have. At the start of these rounds, you get the food.",
  onPlay(game, player) {
    const plantedFields = player.getPlantedFields().length
    const maxRounds = plantedFields * 3
    const currentRound = game.state.round
    let placed = 0
    for (let round = currentRound + 1; round <= 14 && placed < maxRounds; round++) {
      game.scheduleResource(player, 'food', round, 1)
      placed++
    }
    game.log.add({
      template: '{player} places {amount} food from Garden Claw',
      args: { player, amount: placed },
    })
  },
}
