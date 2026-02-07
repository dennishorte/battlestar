module.exports = {
  id: "family-friendly-home-a021",
  name: "Family Friendly Home",
  deck: "minorA",
  number: 21,
  type: "minor",
  cost: {},
  prereqs: { occupations: 1 },
  category: "Actions Booster",
  text: "Each time you take a \"Build Rooms\" action while having more rooms than people already, you also get a \"Family Growth\" action and 1 food.",
  onBuildRoom(game, player) {
    if (player.getRoomCount() > player.familyMembers) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Family Friendly Home',
        args: { player },
      })
      game.actions.familyGrowth(player, { fromCard: true })
    }
  },
}
