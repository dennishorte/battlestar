module.exports = {
  id: "pet-lover-d138",
  name: "Pet Lover",
  deck: "occupationD",
  number: 138,
  type: "occupation",
  players: "1+",
  text: "Each time you use an accumulation space providing exactly 1 animal, you can leave it on the space and get one from the general supply instead, as well as 3 food and 1 grain.",
  onActionReplace(game, player, actionId) {
    const accumulated = game.getAccumulatedResources(actionId)
    let animalType = null
    let animalCount = 0
    for (const resource of ['sheep', 'boar', 'cattle']) {
      if (accumulated[resource]) {
        animalType = resource
        animalCount += accumulated[resource]
      }
    }
    if (animalCount !== 1 || !animalType) {
      return
    }
    const choices = [`Leave ${animalType} on space: get 1 ${animalType} + 3 food + 1 grain`, 'Skip']
    const selection = game.actions.choose(player, choices, {
      title: 'Pet Lover',
      min: 1,
      max: 1,
    })
    if (selection[0] !== 'Skip') {
      // Undo the animal that was already placed from the accumulation space
      player.removeAnimals(animalType, 1)
      // Restore animal to accumulation space
      const actionState = game.state.actionSpaces[actionId]
      actionState.accumulated += 1
      // Give 1 from general supply instead
      game.actions.handleAnimalPlacement(player, { [animalType]: 1 })
      player.addResource('food', 3)
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} leaves {animal} on space, gets 1 from supply + 3 food + 1 grain from {card}',
        args: { player, animal: animalType, card: this },
      })
    }
  },
}
