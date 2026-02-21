module.exports = {
  id: "food-merchant-d113",
  name: "Food Merchant",
  deck: "occupationD",
  number: 113,
  type: "occupation",
  players: "1+",
  text: "For each grain you harvest from a field, you can buy 1 vegetable for 3 food. If you harvest the last grain from a field, the vegetable costs you only 2 food.",
  onHarvestGrain(game, player, grainCount) {
    if (grainCount > 0 && player.food >= 2) {
      const choices = ['Buy 1 vegetable for 3 food', 'Skip']
      // Cheaper option if enough food — simplified from per-field tracking
      if (player.food >= 3) {
        // Default to standard cost
      }
      else {
        // Can only afford the cheaper option
        choices[0] = 'Buy 1 vegetable for 2 food'
      }
      const selection = game.actions.choose(player, choices, {
        title: 'Food Merchant',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        const cost = player.food >= 3 ? 3 : 2
        player.removeResource('food', cost)
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} buys 1 vegetable for {cost} food ({card})',
          args: { player, cost , card: this},
        })
      }
    }
  },
}
