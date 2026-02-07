module.exports = {
  id: "lifting-machine-a070",
  name: "Lifting Machine",
  deck: "minorA",
  number: 70,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { fields: 3 },
  category: "Crop Provider",
  text: "At the end of each round that does not end with a harvest, you can move 1 vegetable from one of your fields to your supply. (This is not considered a field phase.)",
  onRoundEnd(game, player, round) {
    if (!game.isHarvestRound(round) && player.getVegetableFieldCount() > 0) {
      game.actions.offerLiftingMachine(player, this)
    }
  },
}
