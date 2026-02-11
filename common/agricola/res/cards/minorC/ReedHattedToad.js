module.exports = {
  id: "reed-hatted-toad-c078",
  name: "Reed-Hatted Toad",
  deck: "minorC",
  number: 78,
  type: "minor",
  cost: { food: 1 },
  category: "Building Resource Provider",
  text: "Add 5, 7, 9, 11, and 13 to the current round and place 1 reed on each corresponding round space. At the start of these rounds, you get the reed.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (const offset of [5, 7, 9, 11, 13]) {
      const round = currentRound + offset
      game.scheduleResource(player, 'reed', round, 1)
    }
    game.log.add({
      template: '{player} schedules reed from Reed-Hatted Toad',
      args: { player },
    })
  },
}
