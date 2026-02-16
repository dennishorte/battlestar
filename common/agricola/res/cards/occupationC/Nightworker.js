module.exports = {
  id: "nightworker-c125",
  name: "Nightworker",
  deck: "occupationC",
  number: 125,
  type: "occupation",
  players: "1+",
  text: "Before the start of each work phase, you can place a person on an accumulation space of a building resource not in your supply. (Then proceed with the start player.)",
  onWorkPhaseStart(game, player) {
    if (player.getAvailableWorkers() === 0) {
      return
    }

    const missingResources = []
    if (player.wood === 0) {
      missingResources.push('wood')
    }
    if (player.clay === 0) {
      missingResources.push('clay')
    }
    if (player.reed === 0) {
      missingResources.push('reed')
    }
    if (player.stone === 0) {
      missingResources.push('stone')
    }

    if (missingResources.length === 0) {
      return
    }

    const eligibleSpaces = []
    for (const actionId of game.state.activeActions) {
      if (!game.isBuildingResourceAccumulationSpace(actionId)) {
        continue
      }
      const state = game.state.actionSpaces[actionId]
      if (state.occupiedBy) {
        continue
      }
      const goodType = game.getAccumulationSpaceGoodType(actionId)
      if (missingResources.includes(goodType) && state.accumulated > 0) {
        const action = game.getActionById(actionId)
        eligibleSpaces.push({ actionId, name: action.name, amount: state.accumulated, goodType })
      }
    }

    if (eligibleSpaces.length === 0) {
      return
    }

    const choices = [
      'Pass',
      ...eligibleSpaces.map(s => `${s.name} (${s.amount} ${s.goodType})`),
    ]

    const selection = game.actions.choose(player, choices, {
      title: 'Nightworker: Place person on building resource space?',
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Pass') {
      return
    }

    const selectedIdx = choices.indexOf(selection[0]) - 1
    const selected = eligibleSpaces[selectedIdx]

    const state = game.state.actionSpaces[selected.actionId]
    state.occupiedBy = player.name
    player.useWorker()
    state.personNumber = player.getPersonPlacedThisRound()
    player._lastActionId = selected.actionId

    game.log.add({
      template: '{player} places person on {action} via Nightworker',
      args: { player, action: selected.name },
    })

    game.actions.executeAction(player, selected.actionId)
  },
}
