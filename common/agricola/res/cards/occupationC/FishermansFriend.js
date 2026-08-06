module.exports = {
  id: "fishermans-friend-c159",
  name: "Fisherman's Friend",
  deck: "occupationC",
  number: 159,
  type: "occupation",
  players: "4+",
  text: "At the start of each round, if there is more food on the \"Traveling Players\" than on the \"Fishing\" accumulation space, you get the difference from the general supply.",
  matches_onRoundStart(game, _player) {
    const travelingFood = game.getAccumulatedResources('traveling-players').food || 0
    const fishingFood = game.getAccumulatedResources('fishing').food || 0
    return travelingFood - fishingFood > 0
  },
  onRoundStart(game, player) {
    const travelingFood = game.getAccumulatedResources('traveling-players').food || 0
    const fishingFood = game.getAccumulatedResources('fishing').food || 0
    const diff = travelingFood - fishingFood
    player.addResource('food', diff)
    game.log.add({
      template: '{player} gets {amount} food from {card}',
      args: { player, amount: diff, card: this },
    })
  },
}
