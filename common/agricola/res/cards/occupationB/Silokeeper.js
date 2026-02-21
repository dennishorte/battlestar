module.exports = {
  id: "silokeeper-b112",
  name: "Silokeeper",
  deck: "occupationB",
  number: 112,
  type: "occupation",
  players: "1+",
  text: "Each time you use the action space card that has been revealed right before the most recent harvest, you also get 1 grain.",
  onAction(game, player, actionId) {
    const preHarvestActionRounds = [4, 7, 9, 11, 13]
    const lastHarvest = game.state.lastHarvestRound || 0
    const preHarvestRound = preHarvestActionRounds.find(r => r === lastHarvest) || 0
    if (preHarvestRound > 0 && game.getActionSpaceRound(actionId) === preHarvestRound) {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from {card}',
        args: { player , card: this},
      })
    }
  },
}
