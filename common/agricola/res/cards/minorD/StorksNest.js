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
    if (player.getRoomCount() > player.familyMembers && player.food >= 1 && player.canAddFamilyMember()) {
      game.actions.offerStorksNest(player, this)
    }
  },
}
