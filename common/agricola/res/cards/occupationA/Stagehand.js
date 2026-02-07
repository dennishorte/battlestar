module.exports = {
  id: "stagehand-a150",
  name: "Stagehand",
  deck: "occupationA",
  number: 150,
  type: "occupation",
  players: "3+",
  text: "Each time another player uses the \"Traveling Players\" accumulation space, you can take your choice of a \"Build Fences\", \"Build Stables\", or \"Build Rooms\" action.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'traveling-players' && actingPlayer.name !== cardOwner.name) {
      game.actions.offerBuildChoice(cardOwner, this, ['fences', 'stables', 'rooms'])
    }
  },
}
