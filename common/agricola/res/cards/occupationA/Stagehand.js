module.exports = {
  id: "stagehand-a150",
  name: "Stagehand",
  deck: "occupationA",
  number: 150,
  type: "occupation",
  players: "3+",
  text: "Each time another player uses the \"Traveling Players\" accumulation space, you can take your choice of a \"Build Fences\", \"Build Stables\", or \"Build Rooms\" action.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId !== 'traveling-players' || actingPlayer.name === cardOwner.name) {
      return
    }
    const choices = ['Build Fences', 'Build Stables', 'Build Rooms', 'Skip']
    const selection = game.actions.choose(cardOwner, choices, {
      title: 'Stagehand: Take a build action?',
      min: 1,
      max: 1,
    })
    const choice = selection[0]
    if (choice === 'Skip') {
      return
    }
    if (choice === 'Build Fences') {
      game.actions.buildFences(cardOwner)
    }
    else if (choice === 'Build Stables') {
      game.actions.buildStable(cardOwner)
    }
    else if (choice === 'Build Rooms') {
      game.actions.buildRoom(cardOwner)
    }
  },
}
