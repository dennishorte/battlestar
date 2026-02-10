module.exports = {
  id: "churchyard-d047",
  name: "Churchyard",
  deck: "minorD",
  number: 47,
  type: "minor",
  cost: { stone: 1, reed: 1 },
  vps: 1,
  prereqs: { cardsInPlay: 10 },
  category: "Food Provider",
  text: "Place 2 food on each remaining round space. At the start of these rounds, you get the food.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (let round = currentRound + 1; round <= 14; round++) {
      game.scheduleResource(player, 'food', round, 2)
    }
    game.log.add({
      template: '{player} schedules 2 food per round from Churchyard',
      args: { player },
    })
  },
}
