module.exports = {
  id: "fishermans-friend-c159",
  name: "Fisherman's Friend",
  deck: "occupationC",
  number: 159,
  type: "occupation",
  players: "4+",
  text: "At the start of each round, if there is more food on the \"Traveling Players\" than on the \"Fishing\" accumulation space, you get the difference from the general supply.",
  onRoundStart(game, player) {
    const travelingFood = game.getAccumulatedResources('traveling-players').food || 0
    const fishingFood = game.getAccumulatedResources('fishing').food || 0
    const diff = travelingFood - fishingFood
    if (diff > 0) {
      player.addResource('food', diff)
      game.log.add({
        template: "{player} gets {amount} food from Fisherman's Friend",
        args: { player, amount: diff },
      })
    }
  },
}
