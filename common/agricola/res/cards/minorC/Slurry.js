module.exports = {
  id: "slurry-c071",
  name: "Slurry",
  deck: "minorC",
  number: 71,
  type: "minor",
  cost: {},
  category: "Actions Booster",
  text: "In the breeding phase of each harvest, if you get newborn animals of at least two types, you also get a \"Sow\" action.",
  matches_onBreedingPhaseEnd(_game, _player, newbornTypes) {
    return newbornTypes >= 2
  },
  onBreedingPhaseEnd(game, player, _newbornTypes) {
    game.actions.sow(player)
  },
}
