module.exports = {
  id: "lunchtime-beer-e058",
  name: "Lunchtime Beer",
  deck: "minorE",
  number: 58,
  type: "minor",
  cost: {},
  text: "At the start of each harvest, you can choose to skip the field and breeding phase of that harvest and get exactly 1 food instead.",
  onHarvestStart(game, player) {
    const choices = ['Skip field and breeding (get 1 food)', 'Normal harvest']
    const selection = game.actions.choose(player, choices, {
      title: 'Lunchtime Beer: Skip field and breeding phase?',
      min: 1,
      max: 1,
    })

    if (selection[0].startsWith('Skip')) {
      if (!game.state.skipFieldAndBreeding) {
        game.state.skipFieldAndBreeding = []
      }
      game.state.skipFieldAndBreeding.push(player.name)
      player.addResource('food', 1)
      game.log.add({
        template: '{player} skips field and breeding phases, gets 1 food from {card}',
        args: { player, card: this },
      })
    }
  },
}
