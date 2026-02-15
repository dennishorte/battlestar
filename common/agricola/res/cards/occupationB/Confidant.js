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
    const choices = choicePairs.map(([, label]) => label)
    if (choices.length === 0) {
      return
    }
    const selection = game.actions.choose(player, choices, {
      title: 'Confidant: Place food on how many round spaces?',
      min: 1,
      max: 1,
    })
    const num = choicePairs.find(([, label]) => label === selection[0])[0]
    player.payCost({ food: num })
    const currentRound = game.state.round
    for (let i = 1; i <= num; i++) {
      const round = currentRound + i
      if (round <= 14) {
        game.scheduleResource(player, 'food', round, 1)
      }
    }
    game.log.add({
      template: '{player} places {num} food on the next {num} round spaces (Confidant)',
      args: { player, num },
    })
  },
}
