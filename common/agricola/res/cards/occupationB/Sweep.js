module.exports = {
  id: "sweep-b120",
  name: "Sweep",
  deck: "occupationB",
  number: 120,
  type: "occupation",
  players: "1+",
  text: "Each time before you use the action space card left of the card that has been most recently placed on a round space, you get 2 clay.",
  matches_onBeforeAction(game, _player, actionId) {
    const mostRecentRound = game.getMostRecentlyRevealedRound()
    const leftOfRecentRound = mostRecentRound - 1
    return leftOfRecentRound >= 1 && leftOfRecentRound <= 12 && game.getActionSpaceRound(actionId) === leftOfRecentRound
  },
  onBeforeAction(_game, player, _actionId) {
    player.addResource('clay', 2)
  },
}
