module.exports = {
  id: "slurry-c071",
  name: "Slurry",
  deck: "minorC",
  number: 71,
  type: "minor",
  cost: {},
  category: "Actions Booster",
  text: "In the breeding phase of each harvest, if you get newborn animals of at least two types, you also get a \"Sow\" action.",
  onBreedingPhaseEnd(game, player, newbornTypes) {
    if (newbornTypes >= 2) {
      game.actions.sow(player)
    }
  },
}
