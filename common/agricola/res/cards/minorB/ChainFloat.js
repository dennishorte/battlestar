module.exports = {
  id: "chain-float-b020",
  name: "Chain Float",
  deck: "minorB",
  number: 20,
  type: "minor",
  cost: { wood: 3 },
  category: "Farm Planner",
  text: "Add 7, 8, and 9 to the current round and place 1 field on each corresponding round space. At the start of these rounds, you can plow the field.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (const offset of [7, 8, 9]) {
      game.scheduleEvent(player, 'plows', currentRound + offset)
    }
    game.log.add({
      template: '{player} schedules fields to plow from Chain Float',
      args: { player },
    })
  },
}
