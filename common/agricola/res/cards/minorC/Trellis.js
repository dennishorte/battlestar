module.exports = {
  id: "trellis-c015",
  name: "Trellis",
  deck: "minorC",
  number: 15,
  type: "minor",
  cost: {},
  prereqs: { occupations: 2 },
  category: "Actions Booster",
  text: "Each time before you use the \"Pig Market\" accumulation space, you can take a \"Build Fences\" action. (You must pay wood for the fences as usual.)",
  onBeforeAction(game, player, actionId) {
    if (actionId === 'take-boar') {
      game.actions.offerBuildFences(player, this)
    }
  },
}
