module.exports = {
  id: "beer-tent-operator-d133",
  name: "Beer Tent Operator",
  deck: "occupationD",
  number: 133,
  type: "occupation",
  players: "1+",
  text: "In the feeding phase of each harvest, you can use this card to turn 1 wood plus 1 grain into 1 bonus point and 2 food.",
  onFeedingPhase(game, player) {
    if (player.wood >= 1 && player.grain >= 1) {
      game.actions.offerBeerTentOperatorConversion(player, this)
    }
  },
}
