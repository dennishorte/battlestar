module.exports = {
  id: "wholesale-market-d057",
  name: "Wholesale Market",
  deck: "minorD",
  number: 57,
  type: "minor",
  cost: { wood: 2, vegetables: 2 },
  vps: 3,
  category: "Food Provider",
  text: "Place 1 food on each remaining round space. At the start of these rounds, you get the food.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (let round = currentRound + 1; round <= 14; round++) {
      game.scheduleResource(player, 'food', round, 1)
    }
    game.log.add({
      template: '{player} schedules food from Wholesale Market',
      args: { player },
    })
  },
}
