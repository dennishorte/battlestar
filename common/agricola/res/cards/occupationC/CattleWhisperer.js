module.exports = {
  id: "cattle-whisperer-c166",
  name: "Cattle Whisperer",
  deck: "occupationC",
  number: 166,
  type: "occupation",
  players: "4+",
  text: "Add 5 and 8 to the current round and place 1 cattle on each corresponding round space. At the start of these rounds, you get the cattle.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (const offset of [5, 8]) {
      const round = currentRound + offset
      game.scheduleResource(player, 'cattle', round, 1)
    }
    game.log.add({
      template: '{player} schedules cattle from {card}',
      args: { player , card: this},
    })
  },
}
