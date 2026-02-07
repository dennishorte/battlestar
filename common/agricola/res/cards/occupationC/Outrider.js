module.exports = {
  id: "outrider-c160",
  name: "Outrider",
  deck: "occupationC",
  number: 160,
  type: "occupation",
  players: "4+",
  text: "Each time before you use the action space on the most recently revealed action space card, you get 1 grain.",
  onBeforeAction(game, player, actionId) {
    if (game.getActionSpaceRound(actionId) === game.getMostRecentlyRevealedRound()) {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from Outrider',
        args: { player },
      })
    }
  },
}
