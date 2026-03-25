module.exports = {
  id: "feed-pellets-d084",
  name: "Feed Pellets",
  deck: "minorD",
  number: 84,
  type: "minor",
  cost: {},
  category: "Livestock Provider",
  text: "When you play this card, you immediately get 1 sheep. In the feeding phase of each harvest, you can exchange exactly 1 vegetable for 1 animal of a type you already have.",
  onPlay(game, player) {
    game.log.add({
      template: '{player} gets 1 sheep',
      args: { player },
    })
    game.actions.handleAnimalPlacement(player, { sheep: 1 })
  },
  matches_onFeedingPhase(_game, player) {
    const hasAnimal = ['sheep', 'boar', 'cattle'].some(type =>
      player.getTotalAnimals(type) >= 1
    )
    return player.vegetables >= 1 && hasAnimal
  },
  onFeedingPhase(game, player) {
    const animalTypes = ['sheep', 'boar', 'cattle'].filter(type =>
      player.getTotalAnimals(type) >= 1
    )
    const choices = animalTypes.map(type => `Pay 1 vegetable for 1 ${type}`)
    choices.push('Skip')
    const selection = game.actions.choose(player, choices, {
      title: 'Feed Pellets',
      min: 1,
      max: 1,
    })
    if (selection[0] !== 'Skip') {
      const type = animalTypes.find(t => selection[0] === `Pay 1 vegetable for 1 ${t}`)
      player.payCost({ vegetables: 1 })
      game.log.add({
        template: '{player} exchanges 1 vegetable for 1 {type}',
        args: { player, type },
      })
      game.actions.handleAnimalPlacement(player, { [type]: 1 })
    }
  },
}
