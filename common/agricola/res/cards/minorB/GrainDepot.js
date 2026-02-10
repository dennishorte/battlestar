module.exports = {
  id: "grain-depot-b065",
  name: "Grain Depot",
  deck: "minorB",
  number: 65,
  type: "minor",
  cost: { wood: 2 },
  costAlternative: { clay: 2 },
  costAlternative2: { stone: 2 },
  category: "Crop Provider",
  text: "If you paid wood/clay/stone for this card, place 1 grain on each of the next 2/3/4 round spaces. At the start of these rounds, you get the grain.",
  onPlay(game, player, paidWith) {
    const currentRound = game.state.round
    let rounds = 2
    if (paidWith === 'clay') {
      rounds = 3
    }
    else if (paidWith === 'stone') {
      rounds = 4
    }

    for (let i = 1; i <= rounds; i++) {
      const round = currentRound + i
      game.scheduleResource(player, 'grain', round, 1)
    }
    game.log.add({
      template: '{player} schedules grain from Grain Depot',
      args: { player },
    })
  },
}
