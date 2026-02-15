module.exports = {
  id: "parrot-breeder-c150",
  name: "Parrot Breeder",
  deck: "occupationC",
  number: 150,
  type: "occupation",
  players: "3+",
  text: "On your turn, if you pay 1 grain to the general supply, you can use the same action space that the player to your right has just used on their turn.",
  // Note: onTurnStart hook, getPlayerToRight, and isEmptyAccumulationSpace
  // are not implemented in the engine.
  onTurnStart(game, player) {
    void(game, player)
  },
}
