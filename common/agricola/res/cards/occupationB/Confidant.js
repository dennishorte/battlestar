module.exports = {
  id: "confidant-b093",
  name: "Confidant",
  deck: "occupationB",
  number: 93,
  type: "occupation",
  players: "1+",
  text: "Place 1 food from your supply on each of the next 2, 3, or 4 round spaces. At the start of these rounds, you get the food back and your choice of a \"Sow\" or \"Build Fences\" action.",
  onPlay(game, player) {
    const numPlayers = game.players.all().length
    const maxSpaces = numPlayers <= 2 ? 2 : numPlayers <= 3 ? 3 : 4
    const choicePairs = [[2, '2 spaces'], [3, '3 spaces'], [4, '4 spaces']].filter(([n]) => n <= maxSpaces && player.food >= n)
    const choices = choicePairs.map(([n, label]) => game.actions.option({ id: `spaces-${n}`, title: label }))
    if (choices.length === 0) {
      return
    }
    const selection = game.actions.choose(player, choices, {
      title: 'Confidant: Place food on how many round spaces?',
      min: 1,
      max: 1,
    })
    const num = parseInt(selection[0].id.replace(/^spaces-/, ''), 10)
    player.payCost({ food: num })
    const currentRound = game.state.round
    for (let i = 1; i <= num; i++) {
      const round = currentRound + i
      if (round <= 14) {
        game.scheduleResource(player, 'food', round, 1)
        game.scheduleEvent(player, 'confidantSowFences', round)
      }
    }
    game.log.add({
      template: '{player} places {num} food on the next {num} round spaces ({card})',
      args: { player, num , card: this},
    })
  },
  matches_onRoundStart(game, player) {
    const scheduled = game.state.scheduledConfidantSowFences?.[player.name] || []
    if (!scheduled.includes(game.state.round)) {
      return false
    }
    // Still run (silently) when scheduled but unable to act, so the entry is cleared.
    const canSow = player.canSowAnything()
    const canFence = player.wood >= 1 || player.getFreeFenceCount() > 0
    return (canSow || canFence) ? true : 'silent'
  },
  onRoundStart(game, player) {
    const round = game.state.round
    game.state.scheduledConfidantSowFences[player.name] =
      game.state.scheduledConfidantSowFences[player.name].filter(r => r !== round)

    const canSow = player.canSowAnything()
    const canFence = player.wood >= 1 || player.getFreeFenceCount() > 0
    if (!canSow && !canFence) {
      return
    }
    const choices = []
    if (canSow) {
      choices.push(game.actions.option({ id: 'sow', title: 'Sow' }))
    }
    if (canFence) {
      choices.push(game.actions.option({ id: 'build-fences', title: 'Build Fences' }))
    }
    choices.push(game.actions.option({ id: 'skip', title: 'Skip' }))
    const selection = game.actions.choose(player, choices, {
      title: 'Confidant: Choose an action',
      min: 1,
      max: 1,
    })
    if (selection[0].id === 'sow') {
      game.actions.sow(player)
    }
    else if (selection[0].id === 'build-fences') {
      game.actions.buildFences(player)
    }
  },
}
