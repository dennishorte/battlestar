module.exports = {
  id: "scrap-collector-e120",
  name: "Scrap Collector",
  deck: "occupationE",
  number: 120,
  type: "occupation",
  players: "1+",
  text: "Alternate placing 1 wood and 1 clay on each of the next 6 round spaces, starting with wood. At the start of these rounds, you get the respective resource.",
  onPlay(game, player) {
    const currentRound = game.state.round
    const resources = ['wood', 'clay', 'wood', 'clay', 'wood', 'clay']
    for (let i = 0; i < 6; i++) {
      const round = currentRound + i + 1
      game.scheduleResource(player, resources[i], round, 1)
    }
    game.log.add({
      template: '{player} schedules alternating wood and clay for next 6 rounds from Scrap Collector',
      args: { player },
    })
  },
}
