module.exports = {
  id: "full-peasant-b130",
  name: "Full Peasant",
  deck: "occupationB",
  number: 130,
  type: "occupation",
  players: "1+",
  text: "Each time after you use the \"Grain Utilization\" or \"Fencing\" action space while the other is unoccupied, you can pay 1 food to use that other space with the same person.",
  onAction(game, player, actionId) {
    if (actionId === 'sow-bake' && !game.isActionOccupied('fencing') && player.food >= 1) {
      game.actions.offerUseOtherSpace(player, this, 'fencing', { cost: { food: 1 } })
    }
    else if (actionId === 'fencing' && !game.isActionOccupied('sow-bake') && player.food >= 1) {
      game.actions.offerUseOtherSpace(player, this, 'sow-bake', { cost: { food: 1 } })
    }
  },
}
