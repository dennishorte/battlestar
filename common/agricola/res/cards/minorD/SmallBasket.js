module.exports = {
  id: "small-basket-d068",
  name: "Small Basket",
  deck: "minorD",
  number: 68,
  type: "minor",
  cost: {},
  prereqs: { occupations: 2 },
  category: "Crop Provider",
  text: "Each time you use the \"Reed Bank\" accumulation space, you can pay 1 reed to get 1 vegetable. If you do in a game with 4+ players, place that 1 reed on the accumulation space.",
  onAction(game, player, actionId) {
    if (actionId === 'take-reed' && player.reed >= 1) {
      const selection = game.actions.choose(player, [
        'Pay 1 reed for 1 vegetable',
        'Skip',
      ], {
        title: 'Small Basket',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.payCost({ reed: 1 })
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} exchanges 1 reed for 1 vegetable using {card}',
          args: { player, card: this },
        })
      }
    }
  },
}
