module.exports = {
  id: "food-distributor-c155",
  name: "Food Distributor",
  deck: "occupationC",
  number: 155,
  type: "occupation",
  players: "4+",
  text: "When you play this card, you immediately get 1 grain and, at the start of this returning home phase, an amount of food equal to the number of occupied action space cards.",
  onPlay(game, player) {
    player.addResource('grain', 1)
    game.log.add({
      template: '{player} gets 1 grain from Food Distributor',
      args: { player },
    })
    player.foodDistributorPending = true
  },
  onReturnHomeStart(game, player) {
    if (player.foodDistributorPending) {
      const occupiedCount = game.getOccupiedActionSpaceCardCount()
      player.addResource('food', occupiedCount)
      game.log.add({
        template: '{player} gets {amount} food from Food Distributor',
        args: { player, amount: occupiedCount },
      })
      player.foodDistributorPending = false
    }
  },
}
