module.exports = {
  id: "archway-d051",
  name: "Archway",
  deck: "minorD",
  number: 51,
  type: "minor",
  cost: { clay: 2 },
  vps: 4,
  prereqs: { noOccupations: true },
  category: "Actions Booster",
  text: "This card is an action space for all. A player who uses it immediately gets 1 food. Immediately before the returning home phase, they can use an unoccupied action space with the person from this card.",
  providesActionSpace: true,
  actionSpaceId: "archway",
  onActionSpaceUsed(game, actingPlayer) {
    actingPlayer.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food from Archway',
      args: { player: actingPlayer },
    })
    // Schedule extra action before returning home
    game.state.archwayPlayer = actingPlayer.name
  },
}
