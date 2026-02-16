module.exports = {
  id: "sample-stable-maker-d102",
  name: "Sample Stable Maker",
  deck: "occupationD",
  number: 102,
  type: "occupation",
  players: "1+",
  text: "At the start of each returning home phase, you can return a built stable to your supply to get 1 wood, 1 grain, 1 food, and a \"Minor Improvement\" action.",
  onReturnHomeStart(game, player) {
    const stables = player.getStableSpaces()
    if (stables.length === 0) {
      return
    }

    const choices = stables.map(s => `Return stable at ${s.row},${s.col}`)
    choices.push('Skip')
    const selection = game.actions.choose(player, choices, {
      title: 'Sample Stable Maker: Return a stable?',
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Skip') {
      return
    }

    // Parse chosen stable coordinates
    const match = selection[0].match(/(\d+),(\d+)/)
    const row = parseInt(match[1])
    const col = parseInt(match[2])

    // Remove the stable
    const space = player.getSpace(row, col)
    space.hasStable = false

    // If this stable had an animal, it's released
    if (space.animal) {
      space.animal = null
    }

    game.log.add({
      template: '{player} returns stable at {row},{col} using Sample Stable Maker',
      args: { player, row, col },
    })

    // Give resources
    player.addResource('wood', 1)
    player.addResource('grain', 1)
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 wood, 1 grain, 1 food from Sample Stable Maker',
      args: { player },
    })

    // Offer Minor Improvement action
    game.actions.buyImprovement(player, false, true)
  },
}
