module.exports = {
  id: "chophouse-b043",
  name: "Chophouse",
  deck: "minorB",
  number: 43,
  type: "minor",
  cost: { wood: 2 },
  costAlternative: { clay: 2 },
  vps: 1,
  category: "Food Provider",
  text: "Each time you use the \"Grain Seeds\"/\"Vegetable Seeds\" action space, place 1 food on each of the next 3/2 round spaces. At the start of these rounds, you get the food.",
  onAction(game, player, actionId) {
    const currentRound = game.state.round
    let rounds = 0
    if (actionId === 'take-grain') {
      rounds = 3
    }
    else if (actionId === 'take-vegetable') {
      rounds = 2
    }

    if (rounds > 0) {
      for (let i = 1; i <= rounds; i++) {
        const round = currentRound + i
        game.scheduleResource(player, 'food', round, 1)
      }
      game.log.add({
        template: '{player} places food on the next {count} round spaces from {card}',
        args: { player, count: rounds , card: this},
      })
    }
  },
}
