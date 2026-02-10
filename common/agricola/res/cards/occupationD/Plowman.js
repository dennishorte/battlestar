module.exports = {
  id: "plowman-d091",
  name: "Plowman",
  deck: "occupationD",
  number: 91,
  type: "occupation",
  players: "1+",
  text: "Add 4, 7, and 10 to the current round and place a field tile on each corresponding round space. At the start of these rounds, you can plow the field for 1 food.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (const offset of [4, 7, 10]) {
      const round = currentRound + offset
      game.scheduleEvent(player, 'plowman', round)
    }
    game.log.add({
      template: '{player} schedules field tiles from Plowman',
      args: { player },
    })
  },
  onRoundStart(game, player) {
    const scheduled = game.state.scheduledPlowman?.[player.name] || []
    if (scheduled.includes(game.state.round) && player.food >= 1) {
      game.actions.offerPlowForFood(player, this)
    }
  },
}
