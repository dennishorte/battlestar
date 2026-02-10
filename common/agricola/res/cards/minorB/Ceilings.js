module.exports = {
  id: "ceilings-b076",
  name: "Ceilings",
  deck: "minorB",
  number: 76,
  type: "minor",
  cost: { clay: 1 },
  prereqs: { occupations: 1 },
  category: "Building Resource Provider",
  text: "Place 1 wood on the next 5 round spaces. At the start of these rounds, you get the wood. Remove the wood promised by this card from future round spaces the next time you renovate.",
  onPlay(game, player) {
    const currentRound = game.state.round
    player.ceilingsRounds = []
    for (let i = 1; i <= 5; i++) {
      const round = currentRound + i
      if (game.scheduleResource(player, 'wood', round, 1)) {
        player.ceilingsRounds.push(round)
      }
    }
    game.log.add({
      template: '{player} schedules wood from Ceilings',
      args: { player },
    })
  },
  onRenovate(game, player) {
    if (player.ceilingsRounds && player.ceilingsRounds.length > 0) {
      for (const round of player.ceilingsRounds) {
        if (game.state.scheduledWood && game.state.scheduledWood[player.name] && game.state.scheduledWood[player.name][round]) {
          game.state.scheduledWood[player.name][round]--
          if (game.state.scheduledWood[player.name][round] <= 0) {
            delete game.state.scheduledWood[player.name][round]
          }
        }
      }
      player.ceilingsRounds = []
      game.log.add({
        template: '{player} removes scheduled wood from Ceilings due to renovation',
        args: { player },
      })
    }
  },
}
