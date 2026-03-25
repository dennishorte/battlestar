module.exports = {
  id: "barley-mill-a064",
  name: "Barley Mill",
  deck: "minorA",
  number: 64,
  type: "minor",
  cost: { wood: 1, clay: 4 },
  costAlternative: { wood: 1, stone: 2 },
  vps: 1,
  category: "Food Provider",
  text: "In the field phase of each harvest, you get 1 food for each grain field that you harvest.",
  matches_onHarvest(_game, player) {
    return player.getGrainFieldCount() > 0
  },
  onHarvest(game, player) {
    const grainFields = player.getGrainFieldCount()
    player.addResource('food', grainFields)
    game.log.add({
      template: '{player} gets {amount} food',
      args: { player, amount: grainFields },
    })
  },
}
