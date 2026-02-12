module.exports = {
  id: "beer-stall-c049",
  name: "Beer Stall",
  deck: "minorC",
  number: 49,
  type: "minor",
  cost: { wood: 1 },
  category: "Food Provider",
  text: "In the feeding phase of each harvest, for each empty unfenced stable you have, you can exchange 1 grain for 5 food.",
  onFeedingPhase(game, player) {
    // Count empty unfenced stables
    let emptyUnfencedStables = 0
    for (const stable of player.getStableSpaces()) {
      if (!player.getPastureAtSpace(stable.row, stable.col) && !stable.animal) {
        emptyUnfencedStables++
      }
    }
    if (emptyUnfencedStables > 0 && player.grain >= 1) {
      const maxExchanges = Math.min(emptyUnfencedStables, player.grain)
      const choices = []
      for (let i = maxExchanges; i >= 1; i--) {
        choices.push(`Exchange ${i} grain for ${i * 5} food`)
      }
      choices.push('Skip')
      const selection = game.actions.choose(player, choices, {
        title: 'Beer Stall',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        const amount = parseInt(selection[0].match(/^Exchange (\d+)/)[1])
        player.payCost({ grain: amount })
        player.addResource('food', amount * 5)
        game.log.add({
          template: '{player} exchanges {amount} grain for {food} food using {card}',
          args: { player, amount, food: amount * 5, card: this },
        })
      }
    }
  },
}
