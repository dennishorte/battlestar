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
  onBuildRoom(game, player, _roomType, count = 1) {
    if (player._familyFriendlyHomeTriggered) {
      return
    }

    const preActionRooms = player._preActionRoomCount !== undefined
      ? player._preActionRoomCount
      : player.getRoomCount() - count

    const peopleCount = player.getFamilySize()

    if (preActionRooms > peopleCount) {
      player._familyFriendlyHomeTriggered = true
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from {card}',
        args: { player , card: this},
      })
      game.actions.familyGrowth(player, { fromCard: true })
    }
  },
}
