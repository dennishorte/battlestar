module.exports = {
  id: "large-scale-farmer-b150",
  name: "Large-Scale Farmer",
  deck: "occupationB",
  number: 150,
  type: "occupation",
  players: "3+",
  text: "Each time after you use the \"Farm Expansion\" or \"Major Improvement\" action space while the other is unoccupied, you can pay 1 food to use that other space with the same person.",
  onAction(game, player, actionId) {
    if (actionId === 'build-room-stable' && !game.isActionOccupied('major-minor-improvement') && player.food >= 1) {
      game.actions.offerUseOtherSpace(player, this, 'major-minor-improvement', { cost: { food: 1 } })
    }
    else if (actionId === 'major-minor-improvement' && !game.isActionOccupied('build-room-stable') && player.food >= 1) {
      game.actions.offerUseOtherSpace(player, this, 'build-room-stable', { cost: { food: 1 } })
    }
  },
}
