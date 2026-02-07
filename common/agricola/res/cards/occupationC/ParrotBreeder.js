module.exports = {
  id: "parrot-breeder-c150",
  name: "Parrot Breeder",
  deck: "occupationC",
  number: 150,
  type: "occupation",
  players: "3+",
  text: "On your turn, if you pay 1 grain to the general supply, you can use the same action space that the player to your right has just used on their turn.",
  onTurnStart(game, player) {
    const rightPlayer = game.getPlayerToRight(player)
    const lastAction = rightPlayer.lastActionThisTurn
    if (lastAction && player.grain >= 1 && !game.isEmptyAccumulationSpace(lastAction)) {
      game.actions.offerParrotBreederCopy(player, this, lastAction)
    }
  },
}
