module.exports = {
  id: "grassland-harrow-b018",
  name: "Grassland Harrow",
  deck: "minorB",
  number: 18,
  type: "minor",
  cost: { wood: 2 },
  prereqs: { occupations: 2, buildingResourcesInSupply: 1 },
  category: "Farm Planner",
  text: "Add 1 to the current round for each building resource in your supply and place 1 field on the corresponding round space. At the start of that round, you can plow the field.",
  onPlay(game, player) {
    const buildingResources = player.wood + player.clay + player.reed + player.stone
    const targetRound = game.state.round + buildingResources
    if (game.scheduleEvent(player, 'plows', targetRound)) {
      game.log.add({
        template: '{player} schedules a field to plow in round {round} via Grassland Harrow',
        args: { player, round: targetRound },
      })
    }
  },
}
