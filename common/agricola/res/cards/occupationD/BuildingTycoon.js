module.exports = {
  id: "building-tycoon-d128",
  name: "Building Tycoon",
  deck: "occupationD",
  number: 128,
  type: "occupation",
  players: "1+",
  text: "Each time after another player builds 1 or more rooms, you can give them 1 food to build exactly 1 room yourself. (You must pay the building cost of the room.)",
  onAnyBuildRoom(game, actingPlayer, cardOwner) {
    if (actingPlayer.name !== cardOwner.name && cardOwner.food >= 1) {
      game.actions.offerBuildingTycoonRoom(cardOwner, actingPlayer, this)
    }
  },
}
