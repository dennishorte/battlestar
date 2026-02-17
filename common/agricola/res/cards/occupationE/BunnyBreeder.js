module.exports = {
  id: "bunny-breeder-e139",
  name: "Bunny Breeder",
  deck: "occupationE",
  number: 139,
  type: "occupation",
  players: "1+",
  text: "Select a future round space, subtract the number of the current round from it, and place this many food on that space. At the start of that round, you get the food.",
  onPlay(game, player) {
    const currentRound = game.state.round
    const choices = []
    for (let round = currentRound + 1; round <= 14; round++) {
      const food = round - currentRound
      choices.push(`Round ${round} (${food} food)`)
    }

    if (choices.length === 0) {
      return
    }

    const selection = game.actions.choose(player, choices, {
      title: 'Bunny Breeder: Select a future round',
      min: 1,
      max: 1,
    })

    const round = parseInt(selection[0].split(' ')[1])
    const food = round - currentRound

    game.scheduleResource(player, 'food', round, food)
    game.log.add({
      template: '{player} places {food} food on round {round} using Bunny Breeder',
      args: { player, food, round },
    })
  },
}
