module.exports = {
  id: "food-basket-a008",
  name: "Food Basket",
  deck: "minorA",
  number: 8,
  type: "minor",
  cost: { reed: 1 },
  prereqs: { occupations: 2, improvements: 2 },
  category: "Crop Provider",
  text: "You immediately get 1 grain and 1 vegetable.",
  onPlay(game, player) {
    player.addResource('grain', 1)
    player.addResource('vegetables', 1)
    game.log.add({
      template: '{player} gets 1 grain and 1 vegetable from Food Basket',
      args: { player },
    })
  },
}
