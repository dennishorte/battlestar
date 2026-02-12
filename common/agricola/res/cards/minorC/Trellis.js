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
      if (player.wood >= 1 || player.getFreeFenceCount() > 0) {
        const selection = game.actions.choose(player, [
          'Build Fences',
          'Skip',
        ], { title: 'Trellis', min: 1, max: 1 })
        if (selection[0] !== 'Skip') {
          game.actions.buildFences(player)
        }
      }
    }
  },
}
