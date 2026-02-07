module.exports = {
  id: "agricultural-fertilizers-a073",
  name: "Agricultural Fertilizers",
  deck: "minorA",
  number: 73,
  type: "minor",
  cost: {},
  prereqs: { pastures: 1 },
  category: "Crop Provider",
  text: "Each time after you turn at least 2 unused spaces into used spaces in one action, you get an additional \"Sow\" action.",
  onUseMultipleSpaces(game, player, spaceCount) {
    if (spaceCount >= 2) {
      game.log.add({
        template: '{player} gets an additional Sow action from Agricultural Fertilizers',
        args: { player },
      })
      game.actions.sow(player)
    }
  },
}
