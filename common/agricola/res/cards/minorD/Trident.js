module.exports = {
  id: "trident-d007",
  name: "Trident",
  deck: "minorD",
  number: 7,
  type: "minor",
  cost: { wood: 1 },
  prereqs: {
    roundIn: [3, 6, 9, 12],
  },
  category: "Food Provider",
  text: "If you play this card in round 3/6/9/12, you immediately get 3/4/5/6 food.",
  onPlay(game, player) {
    const round = game.state.round
    const foodByRound = { 3: 3, 6: 4, 9: 5, 12: 6 }
    const food = foodByRound[round] || 0
    if (food > 0) {
      player.addResource('food', food)
      game.log.add({
        template: '{player} gets {amount} food from Trident',
        args: { player, amount: food },
      })
    }
  },
}
