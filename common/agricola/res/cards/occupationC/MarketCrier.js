module.exports = {
  id: "market-crier-c142",
  name: "Market Crier",
  deck: "occupationC",
  number: 142,
  type: "occupation",
  players: "3+",
  text: "Each time you use the \"Grain Seeds\" action space, you can get an additional 1 grain and 1 vegetable. If you do, each other player gets 1 grain from the general supply.",
  onAction(game, player, actionId) {
    if (actionId === 'take-grain') {
      const selection = game.actions.choose(player, () => [
        'Get 1 grain and 1 vegetable (others get 1 grain)',
        'Skip',
      ], { title: 'Market Crier', min: 1, max: 1 })
      if (selection[0] !== 'Skip') {
        player.addResource('grain', 1)
        player.addResource('vegetables', 1)
        for (const other of game.players.all()) {
          if (other !== player) {
            other.addResource('grain', 1)
          }
        }
        game.log.add({
          template: '{player} gets 1 grain and 1 vegetable from {card}; others get 1 grain',
          args: { player , card: this},
        })
      }
    }
  },
}
