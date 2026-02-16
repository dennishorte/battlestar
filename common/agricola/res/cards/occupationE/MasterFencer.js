module.exports = {
  id: "master-fencer-e088",
  name: "Master Fencer",
  deck: "occupationE",
  number: 88,
  type: "occupation",
  players: "1+",
  text: "Once you live in a stone house, at the start of each round, you can pay 2 or 3 wood to build up to 3 or 4 fences, respectively.",
  onRoundStart(game, player) {
    if (player.roomType !== 'stone' || player.wood < 2) {
      return
    }
    const choices = []
    if (player.wood >= 2) {
      choices.push('Pay 2 wood for up to 3 fences')
    }
    if (player.wood >= 3) {
      choices.push('Pay 3 wood for up to 4 fences')
    }
    choices.push('Skip')

    const selection = game.actions.choose(player, choices, {
      title: 'Master Fencer: Build fences?',
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Skip') {
      return
    }

    if (selection[0] === 'Pay 2 wood for up to 3 fences') {
      player.payCost({ wood: 2 })
      player._masterFencerFreeFences = 3
    }
    else {
      player.payCost({ wood: 3 })
      player._masterFencerFreeFences = 4
    }

    game.actions.buildFences(player)
    delete player._masterFencerFreeFences
  },
  modifyFenceCost(player, fenceCount) {
    const freeFences = player._masterFencerFreeFences || 0
    if (freeFences > 0) {
      return Math.max(0, fenceCount - freeFences)
    }
    return fenceCount
  },
}
