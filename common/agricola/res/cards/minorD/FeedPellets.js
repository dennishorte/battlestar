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
    player.addAnimals('sheep', 1)
    game.log.add({
      template: '{player} gets 1 sheep from {card}',
      args: { player , card: this},
    })
  },
  onFeedingPhase(game, player) {
    const animalTypes = ['sheep', 'boar', 'cattle'].filter(type =>
      player.getTotalAnimals(type) >= 1
    )
    if (player.vegetables >= 1 && animalTypes.length > 0) {
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
        player.addAnimals(type, 1)
        game.log.add({
          template: '{player} exchanges 1 vegetable for 1 {type} using {card}',
          args: { player, type, card: this },
        })
      }
    }
  },
}
