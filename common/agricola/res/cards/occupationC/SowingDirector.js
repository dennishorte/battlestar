module.exports = {
  id: "sowing-director-c151",
  name: "Sowing Director",
  deck: "occupationC",
  number: 151,
  type: "occupation",
  players: "3+",
  text: "Each time after another player uses the \"Grain Utilization\" action space, you get a \"Sow\" action.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'sow-bake' && actingPlayer.name !== cardOwner.name) {
      game.actions.sow(cardOwner)
    }
  },
}
