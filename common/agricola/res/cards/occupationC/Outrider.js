module.exports = {
  id: "outrider-c160",
  name: "Outrider",
  deck: "occupationC",
  number: 160,
  type: "occupation",
  players: "4+",
  text: "Each time before you use the action space on the most recently revealed action space card, you get 1 grain.",
  matches_onBeforeAction(game, _player, actionId) {
    return game.getActionSpaceRound(actionId) === game.getMostRecentlyRevealedRound()
  },
  onBeforeAction(_game, player, _actionId) {
    player.addResource('grain', 1)
  },
}
