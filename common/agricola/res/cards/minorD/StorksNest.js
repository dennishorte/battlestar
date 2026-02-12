module.exports = {
  id: "storks-nest-d010",
  name: "Stork's Nest",
  deck: "minorD",
  number: 10,
  type: "minor",
  cost: { reed: 1 },
  prereqs: { occupations: 5 },
  category: "Actions Booster",
  text: "In the returning home phase of each round, if you have more rooms than people, you can pay 1 food to take a \"Family Growth\" action.",
  onReturnHome(game, player) {
    if (player.getRoomCount() > player.familyMembers && player.food >= 1 && player.canGrowFamily()) {
      const selection = game.actions.choose(player, [
        'Pay 1 food for Family Growth',
        'Skip',
      ], { title: "Stork's Nest", min: 1, max: 1 })
      if (selection[0] !== 'Skip') {
        player.addResource('food', -1)
        game.actions.familyGrowth(player)
        game.log.add({
          template: "{player} pays 1 food for Family Growth via Stork's Nest",
          args: { player },
        })
      }
    }
  },
}
