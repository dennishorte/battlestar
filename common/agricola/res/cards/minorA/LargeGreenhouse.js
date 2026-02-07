module.exports = {
  id: "large-greenhouse-a069",
  name: "Large Greenhouse",
  deck: "minorA",
  number: 69,
  type: "minor",
  cost: { wood: 2 },
  prereqs: { occupations: 2 },
  category: "Crop Provider",
  text: "Add 4, 7, and 9 to the current round and place 1 vegetable on each corresponding round space. At the start of these rounds, you get the vegetable.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (const offset of [4, 7, 9]) {
      const round = currentRound + offset
      if (round <= 14) {
        if (!game.state.scheduledVegetables) {
          game.state.scheduledVegetables = {}
        }
        if (!game.state.scheduledVegetables[player.name]) {
          game.state.scheduledVegetables[player.name] = {}
        }
        game.state.scheduledVegetables[player.name][round] =
            (game.state.scheduledVegetables[player.name][round] || 0) + 1
      }
    }
    game.log.add({
      template: '{player} schedules vegetables from Large Greenhouse',
      args: { player },
    })
  },
}
