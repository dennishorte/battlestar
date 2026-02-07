module.exports = {
  id: "straw-manure-d070",
  name: "Straw Manure",
  deck: "minorD",
  number: 70,
  type: "minor",
  cost: {},
  prereqs: { fields: 2 },
  category: "Crop Provider",
  text: "Before the field phase of each harvest, you can pay 1 grain from your supply to add 1 vegetable to each of up to 2 vegetable fields.",
  onBeforeFieldPhase(game, player) {
    if (player.grain >= 1 && player.getVegetableFieldCount() > 0) {
      game.actions.offerStrawManure(player, this)
    }
  },
}
