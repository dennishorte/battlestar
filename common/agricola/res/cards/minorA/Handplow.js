module.exports = {
  id: "handplow-a019",
  name: "Handplow",
  deck: "minorA",
  number: 19,
  type: "minor",
  cost: { wood: 1 },
  category: "Farm Planner",
  text: "Add 5 to the current round and place 1 field tile on the corresponding round space. At the start of that round, you can plow the field.",
  onPlay(game, player) {
    const targetRound = game.state.round + 5
    if (game.scheduleEvent(player, 'plows', targetRound)) {
      game.log.add({
        template: '{player} schedules a field to plow in round {round}',
        args: { player, round: targetRound },
      })
    }
  },
}
