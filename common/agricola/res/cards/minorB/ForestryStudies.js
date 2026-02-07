module.exports = {
  id: "forestry-studies-b028",
  name: "Forestry Studies",
  deck: "minorB",
  number: 28,
  type: "minor",
  cost: { food: 2 },
  category: "Actions Booster",
  text: "Each time after you use the \"Forest\" accumulation space, you can return 2 wood to that space to play 1 occupation without paying an occupation cost.",
  onAction(game, player, actionId) {
    if (actionId === 'take-wood' && player.wood >= 2) {
      game.actions.offerForestryStudies(player, this)
    }
  },
}
