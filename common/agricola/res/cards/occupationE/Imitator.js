module.exports = {
  id: "imitator-e129",
  name: "Imitator",
  deck: "occupationE",
  number: 129,
  type: "occupation",
  players: "1+",
  text: "If you have a person on the \"Day Laborer\" action space, you can use non-accumulating round 1-9 action spaces even if they are occupied.",
  allowsIgnoreOccupied(player, actionId, game) {
    return player.occupiesActionSpace('day-laborer') &&
             game.isNonAccumulatingActionSpace(actionId) &&
             game.getActionSpaceRound(actionId) >= 1 &&
             game.getActionSpaceRound(actionId) <= 9
  },
}
