module.exports = {
  id: "potato-ridger-a059",
  name: "Potato Ridger",
  deck: "minorA",
  number: 59,
  type: "minor",
  cost: { wood: 1 },
  category: "Crop Provider",
  text: "Each time after you harvest 1+ vegetables, if you then have 3+ vegetables in your supply, you can turn exactly 1 vegetable into 6 food. With 4+ vegetables, you must do so.",
  onHarvestVegetables(game, player) {
    if (player.vegetables >= 4) {
      player.payCost({ vegetables: 1 })
      player.addResource('food', 6)
      game.log.add({
        template: '{player} must convert 1 vegetable to 6 food from {card}',
        args: { player , card: this},
      })
    }
    else if (player.vegetables >= 3) {
      const card = this
      const choices = [
        'Convert 1 vegetable to 6 food',
        'Skip',
      ]
      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Convert vegetable to food?`,
        min: 1,
        max: 1,
      })

      if (selection[0] !== 'Skip') {
        player.payCost({ vegetables: 1 })
        player.addResource('food', 6)
        game.log.add({
          template: '{player} converts 1 vegetable to 6 food using {card}',
          args: { player, card },
        })
      }
    }
  },
}
