module.exports = {
  id: "pet-lover-d138",
  name: "Pet Lover",
  deck: "occupationD",
  number: 138,
  type: "occupation",
  players: "1+",
  text: "Each time you use an accumulation space providing exactly 1 animal, you can leave it on the space and get one from the general supply instead, as well as 3 food and 1 grain.",
  onAction(game, player, actionId) {
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
    const choices = [`Get bonus: 3 food + 1 grain (Pet Lover)`, 'Skip']
    const selection = game.actions.choose(player, choices, {
      title: 'Pet Lover',
      min: 1,
      max: 1,
    })
    if (selection[0] !== 'Skip') {
      player.addResource('food', 3)
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 3 food and 1 grain from Pet Lover',
        args: { player },
      })
    }
  },
}
