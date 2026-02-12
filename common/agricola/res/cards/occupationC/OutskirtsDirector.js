module.exports = {
  id: "outskirts-director-c130",
  name: "Outskirts Director",
  deck: "occupationC",
  number: 130,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Grove\" or \"Hollow\" accumulation space, you can place 2 reed from the general supply on the other space. If you do, you can immediately place another person.",
  onAction(game, player, actionId) {
    const action = game.getActionById(actionId)
    if (!action) {
      return
    }

    let otherName
    if (action.name === 'Grove') {
      otherName = 'Hollow'
    }
    else if (action.name === 'Hollow') {
      otherName = 'Grove'
    }
    else {
      return
    }

    // Find the other space's ID in the active actions
    const otherId = game.state.activeActions.find(id => {
      const a = game.getActionById(id)
      return a && a.name === otherName
    })
    if (!otherId) {
      return
    }

    const selection = game.actions.choose(player, [
      `Place 2 reed on ${otherName}`,
      'Do not place reed',
    ], {
      title: 'Outskirts Director',
      min: 1,
      max: 1,
    })

    if (selection[0] === `Place 2 reed on ${otherName}`) {
      const otherState = game.state.actionSpaces[otherId]
      if (!otherState.bonusResources) {
        otherState.bonusResources = {}
      }
      otherState.bonusResources.reed = (otherState.bonusResources.reed || 0) + 2
      game.log.add({
        template: '{player} places 2 reed on {space} (Outskirts Director)',
        args: { player, space: otherName },
      })
      player.availableWorkers += 1
      game.log.add({
        template: '{player} gets an extra action from Outskirts Director',
        args: { player },
      })
    }
  },
}
