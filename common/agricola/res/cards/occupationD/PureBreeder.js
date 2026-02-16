module.exports = {
  id: "pure-breeder-d167",
  name: "Pure Breeder",
  deck: "occupationD",
  number: 167,
  type: "occupation",
  players: "1+",
  text: "You immediately get 1 wood. After each round that does not end with a harvest, you can breed exactly one type of animal. (This is not considered a breeding phase.)",
  onPlay(game, player) {
    player.addResource('wood', 1)
    game.log.add({
      template: '{player} gets 1 wood from Pure Breeder',
      args: { player },
    })
  },
  onRoundEnd(game, player, round) {
    if (game.isHarvestRound(round)) {
      return
    }
    // Check which animal types can breed (2+ of type and room for baby)
    const breedable = []
    for (const type of ['sheep', 'boar', 'cattle']) {
      if (player.getTotalAnimals(type) >= 2 && player.canPlaceAnimals(type, 1)) {
        breedable.push(type)
      }
    }
    if (breedable.length === 0) {
      return
    }
    const choices = breedable.map(type => `Breed ${type}`)
    choices.push('Skip')
    const selection = game.actions.choose(player, choices, {
      title: 'Pure Breeder',
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Skip') {
      return
    }
    const match = selection[0].match(/Breed (\w+)/)
    const animalType = match[1]
    player.addAnimals(animalType, 1)
    game.log.add({
      template: '{player} breeds 1 {type} (Pure Breeder)',
      args: { player, type: animalType },
    })
  },
}
