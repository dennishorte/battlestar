module.exports = {
  id: "scythe-e073",
  name: "Scythe",
  deck: "minorE",
  number: 73,
  type: "minor",
  cost: { wood: 1 },
  text: "During the field phase of each harvest, you can select exactly one of your fields and harvest all the crops planted in it.",
  onFieldPhase(game, player) {
    game.actions.offerScytheHarvest(player, this)
  },
}
