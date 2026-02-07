module.exports = {
  id: "large-scale-farmer-b150",
  name: "Large-Scale Farmer",
  deck: "occupationB",
  number: 150,
  type: "occupation",
  players: "3+",
  text: "Each time after you use the \"Farm Expansion\" or \"Major Improvement\" action space while the other is unoccupied, you can pay 1 food to use that other space with the same person.",
  onAction(game, player, actionId) {
    if (actionId === 'farm-expansion' && !game.isActionOccupied('major-improvement') && player.food >= 1) {
      game.actions.offerUseOtherSpace(player, this, 'major-improvement', { cost: { food: 1 } })
    }
    else if (actionId === 'major-improvement' && !game.isActionOccupied('farm-expansion') && player.food >= 1) {
      game.actions.offerUseOtherSpace(player, this, 'farm-expansion', { cost: { food: 1 } })
    }
  },
}
