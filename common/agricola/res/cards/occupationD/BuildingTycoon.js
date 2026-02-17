module.exports = {
  id: "building-tycoon-d128",
  name: "Building Tycoon",
  deck: "occupationD",
  number: 128,
  type: "occupation",
  players: "1+",
  text: "Each time after another player builds 1 or more rooms, you can give them 1 food to build exactly 1 room yourself. (You must pay the building cost of the room.)",
  onAnyBuildRoom(game, cardOwner, actingPlayer) {
    if (actingPlayer.name === cardOwner.name) {
      return
    }
    if (cardOwner.food < 1) {
      return
    }
    // Check if owner can afford a room and has a valid space
    const validSpaces = cardOwner.getValidRoomBuildSpaces()
    if (validSpaces.length === 0) {
      return
    }
    const affordableOptions = cardOwner.getAffordableRoomCostOptions()
    if (affordableOptions.length === 0) {
      return
    }

    const choices = ['Build a room (pay 1 food to opponent + room cost)', 'Skip']
    const selection = game.actions.choose(cardOwner, choices, {
      title: 'Building Tycoon: Build a room?',
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Skip') {
      return
    }

    // Pay 1 food to the acting player
    cardOwner.removeResource('food', 1)
    actingPlayer.addResource('food', 1)
    game.log.add({
      template: '{player} pays 1 food to {other} (Building Tycoon)',
      args: { player: cardOwner, other: actingPlayer },
    })

    // Build 1 room (the buildRoom method handles space selection and cost payment)
    game.actions.buildRoom(cardOwner)
  },
}
