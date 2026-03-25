module.exports = {
  id: "godly-spouse-d150",
  name: "Godly Spouse",
  deck: "occupationD",
  number: 150,
  type: "occupation",
  players: "1+",
  text: "Each time you take a \"Family Growth\" action with the second person you place in a round, return the first person you placed home.",
  matches_onAction(game, player, actionId) {
    return actionId === 'family-growth' || actionId === 'family-growth-urgent'
  },
  onAction(game, player, _actionId) {
    if (player.getPersonPlacedThisRound() === 2) {
      game.actions.returnWorkerHome(player, 0)
      game.log.add({
        template: '{player} returns first worker home',
        args: { player },
      })
    }
  },
}
