module.exports = {
  id: "shaving-horse-a048",
  name: "Shaving Horse",
  deck: "minorA",
  number: 48,
  type: "minor",
  cost: { wood: 1 },
  category: "Food Provider",
  text: "Each time after you obtain at least 1 wood, if you then have 5 or more wood in your supply, you can exchange 1 wood for 3 food. With 7 or more wood, you must do so.",
  onGainWood(game, player) {
    if (player.wood >= 7) {
      player.payCost({ wood: 1 })
      player.addResource('food', 3)
      game.log.add({
        template: '{player} must exchange 1 wood for 3 food from {card}',
        args: { player , card: this},
      })
    }
    else if (player.wood >= 5) {
      const card = this
      const choices = [
        'Exchange 1 wood for 3 food',
        'Skip',
      ]
      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Exchange wood for food?`,
        min: 1,
        max: 1,
      })

      if (selection[0] !== 'Skip') {
        player.payCost({ wood: 1 })
        player.addResource('food', 3)
        game.log.add({
          template: '{player} exchanges 1 wood for 3 food using {card}',
          args: { player, card },
        })
      }
    }
  },
}
