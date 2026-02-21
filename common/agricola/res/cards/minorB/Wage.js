module.exports = {
  id: "wage-b007",
  name: "Wage",
  deck: "minorB",
  number: 7,
  type: "minor",
  cost: {},
  category: "Food Provider",
  text: "You immediately get 2 food and 1 additional food for each major improvement you have from the bottom row of the supply board.",
  onPlay(game, player) {
    const bottomRowMajors = ['clay-oven', 'stone-oven', 'joinery', 'pottery', 'basketmakers-workshop']
    const count = (player.majorImprovements || []).filter(m => bottomRowMajors.includes(m)).length
    const food = 2 + count
    player.addResource('food', food)
    game.log.add({
      template: '{player} gets {amount} food from {card}',
      args: { player, amount: food , card: this},
    })
  },
}
