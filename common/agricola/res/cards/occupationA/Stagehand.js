module.exports = {
  id: "stagehand-a150",
  name: "Stagehand",
  deck: "occupationA",
  number: 150,
  type: "occupation",
  players: "4+",
  text: "Each time another player uses the \"Traveling Players\" accumulation space, you can take your choice of a \"Build Fences\", \"Build Stables\", or \"Build Rooms\" action.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if ((actionId !== 'traveling-players' && actionId !== 'traveling-players-5') || actingPlayer.name === cardOwner.name) {
      return
    }
    const choices = [
      game.actions.option({ id: 'fences', title: 'Build Fences' }),
      game.actions.option({ id: 'stables', title: 'Build Stables' }),
      game.actions.option({ id: 'rooms', title: 'Build Rooms' }),
      game.actions.option({ id: 'skip', title: 'Skip' }),
    ]
    const selection = game.actions.choose(cardOwner, choices, {
      title: 'Stagehand: Take a build action?',
      min: 1,
      max: 1,
    })
    const choice = selection[0]
    if (choice.id === 'skip') {
      return
    }
    if (choice.id === 'fences') {
      game.actions.buildFences(cardOwner)
    }
    else if (choice.id === 'stables') {
      game.actions.buildStable(cardOwner)
    }
    else if (choice.id === 'rooms') {
      game.actions.buildRoom(cardOwner)
    }
  },
}
