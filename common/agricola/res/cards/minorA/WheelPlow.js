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
  onAction(game, player, actionId) {
    if (!player.wheelPlowUsed && (actionId === 'plow-field' || actionId === 'plow-sow')) {
      if (player.isFirstWorkerThisRound()) {
        player.wheelPlowUsed = true
        game.log.add({
          template: '{player} plows 2 additional fields from Wheel Plow',
          args: { player },
        })
        game.actions.plowField(player, { immediate: true })
        game.actions.plowField(player, { immediate: true })
      }
    }
  },
}
