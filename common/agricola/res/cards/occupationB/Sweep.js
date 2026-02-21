module.exports = {
  id: "sweep-b120",
  name: "Sweep",
  deck: "occupationB",
  number: 120,
  type: "occupation",
  players: "1+",
  text: "Each time before you use the action space card left of the card that has been most recently placed on a round space, you get 2 clay.",
  onBeforeAction(game, player, actionId) {
    const mostRecentRound = game.getMostRecentlyRevealedRound()
    const leftOfRecentRound = mostRecentRound - 1
    if (leftOfRecentRound >= 1 && leftOfRecentRound <= 12 && game.getActionSpaceRound(actionId) === leftOfRecentRound) {
      player.addResource('clay', 2)
      game.log.add({
        template: '{player} gets 2 clay from {card}',
        args: { player , card: this},
      })
    }
  },
}
