module.exports = {
  id: "perennial-rye-c084",
  name: "Perennial Rye",
  deck: "minorC",
  number: 84,
  type: "minor",
  cost: { food: 1 },
  prereqs: { occupations: 2 },
  category: "Livestock Provider",
  text: "Each round that does not end with a harvest, you can pay 1 grain to breed exactly 1 type of animal. (This is not considered a breeding phase.)",
  onRoundEnd(game, player, round) {
    if (!game.isHarvestRound(round) && player.grain >= 1) {
      const breedableTypes = ['sheep', 'boar', 'cattle'].filter(type =>
        player.getTotalAnimals(type) >= 2 && player.canPlaceAnimals(type, 1)
      )
      if (breedableTypes.length === 0) {
        return
      }
      const choices = breedableTypes.map(type => `Pay 1 grain to breed ${type}`)
      choices.push('Skip')
      const selection = game.actions.choose(player, choices, {
        title: 'Perennial Rye',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        const type = breedableTypes.find(t => selection[0] === `Pay 1 grain to breed ${t}`)
        player.payCost({ grain: 1 })
        game.actions.handleAnimalPlacement(player, { [type]: 1 })
        game.log.add({
          template: '{player} pays 1 grain to breed 1 {type} using {card}',
          args: { player, type, card: this },
        })
      }
    }
  },
}
