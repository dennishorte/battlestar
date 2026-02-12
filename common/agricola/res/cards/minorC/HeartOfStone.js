module.exports = {
  id: "heart-of-stone-c021",
  name: "Heart of Stone",
  deck: "minorC",
  number: 21,
  type: "minor",
  cost: { food: 4 },
  category: "Actions Booster",
  text: "Each time a \"Quarry\" accumulation space is revealed, if you have room in your house, you can immediately take a \"Family Growth\" action without placing a person.",
  onStageReveal(game, player, actionId) {
    if ((actionId === 'take-stone-1' || actionId === 'take-stone-2') && player.canGrowFamily()) {
      game.actions.familyGrowthWithoutRoom(player, { fromCard: true, noWorkerPlacement: true })
    }
  },
}
