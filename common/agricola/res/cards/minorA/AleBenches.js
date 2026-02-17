module.exports = {
  id: "ale-benches-a029",
  name: "Ale-Benches",
  deck: "minorA",
  number: 29,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { occupations: 2 },
  category: "Points Provider",
  text: "In the returning home phase of each round, you can pay exactly 1 grain from your supply to get 1 bonus point. If you do, each other player gets 1 food.",
  onReturnHome(game, player) {
    if (player.grain >= 1) {
      const card = this
      const choices = [
        'Pay 1 grain for 1 bonus point',
        'Skip',
      ]
      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Pay grain for bonus point?`,
        min: 1,
        max: 1,
      })

      if (selection[0] !== 'Skip') {
        player.payCost({ grain: 1 })
        player.addBonusPoints(1)
        for (const other of game.players.all()) {
          if (other !== player) {
            other.addResource('food', 1)
          }
        }
        game.log.add({
          template: '{player} pays 1 grain for 1 bonus point using {card}. Each other player gets 1 food.',
          args: { player, card },
        })
      }
    }
  },
}
