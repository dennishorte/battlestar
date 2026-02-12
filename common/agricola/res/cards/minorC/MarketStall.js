module.exports = {
  id: "market-stall-c054",
  name: "Market Stall",
  deck: "minorC",
  number: 54,
  type: "minor",
  cost: { stable: 1 },
  category: "Food Provider",
  text: "After the field phase of each harvest, you can exchange 1 grain plus 1 fence (both from your supply) for 5 food.",
  onFieldPhaseEnd(game, player) {
    if (player.grain >= 1 && player.getFencesInSupply() >= 1) {
      const selection = game.actions.choose(player, [
        'Exchange 1 grain and 1 fence for 5 food',
        'Skip',
      ], {
        title: 'Market Stall',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.payCost({ grain: 1 })
        player.useFenceFromSupply()
        player.addResource('food', 5)
        game.log.add({
          template: '{player} exchanges 1 grain and 1 fence for 5 food using {card}',
          args: { player, card: this },
        })
      }
    }
  },
}
