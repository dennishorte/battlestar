module.exports = {
  id: "schnapps-distillery-c059",
  name: "Schnapps Distillery",
  deck: "minorC",
  number: 59,
  type: "minor",
  cost: { stone: 2, vegetables: 1 },
  vps: 2,
  category: "Food Provider",
  text: "In each feeding phase, you can use this card to turn exactly 1 vegetable into 5 food. During scoring, you get 1 bonus point each for your 5th and 6th vegetable.",
  onFeedingPhase(game, player) {
    if (player.vegetables >= 1) {
      const selection = game.actions.choose(player, [
        'Convert 1 vegetable into 5 food',
        'Skip',
      ], {
        title: 'Schnapps Distillery',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.payCost({ vegetables: 1 })
        player.addResource('food', 5)
        game.log.add({
          template: '{player} converts 1 vegetable into 5 food using {card}',
          args: { player, card: this },
        })
      }
    }
  },
  getEndGamePoints(player) {
    const vegs = player.vegetables
    if (vegs >= 6) {
      return 2
    }
    if (vegs >= 5) {
      return 1
    }
    return 0
  },
}
