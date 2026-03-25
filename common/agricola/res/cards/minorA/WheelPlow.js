module.exports = {
  id: "wheel-plow-a018",
  name: "Wheel Plow",
  deck: "minorA",
  number: 18,
  type: "minor",
  cost: { wood: 2 },
  prereqs: { occupations: 2 },
  category: "Farm Planner",
  text: "Once this game, when you use the \"Farmland\" or \"Cultivation\" action space with the first person you place in a round, you can plow 2 additional fields.",
  matches_onAction(game, player, actionId) {
    return actionId === 'plow-field' || actionId === 'plow-sow'
  },
  onAction(game, player, _actionId) {
    if (!player.wheelPlowUsed && player.isFirstWorkerThisRound()) {
      player.wheelPlowUsed = true
      game.log.add({
        template: '{player} plows 2 additional fields',
        args: { player },
      })
      game.actions.plowField(player)
      game.actions.plowField(player)
    }
  },
}
