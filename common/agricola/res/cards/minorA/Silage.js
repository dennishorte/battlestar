module.exports = {
  id: "silage-a084",
  name: "Silage",
  deck: "minorA",
  number: 84,
  type: "minor",
  cost: {},
  prereqs: { fields: 2 },
  category: "Livestock Provider",
  text: "In each returning home phase after which there is no harvest, you can pay exactly 1 grain - even from a field - to breed exactly one type of animal.",
  onReturnHome(game, player) {
    const round = game.state.round
    if (!game.isHarvestRound(round)) {
      const canPayGrain = player.grain >= 1 || player.getGrainFieldCount() > 0
      if (canPayGrain) {
        const card = this
        const animalTypes = ['sheep', 'boar', 'cattle']
        const hasBreedable = animalTypes.some(type =>
          player.getTotalAnimals(type) >= 2 && player.canPlaceAnimals(type, 1)
        )
        if (!hasBreedable) {
          return
        }

        const selection = game.actions.choose(player, () => {
          const choices = []
          for (const type of animalTypes) {
            if (player.getTotalAnimals(type) >= 2 && player.canPlaceAnimals(type, 1)) {
              choices.push(`Pay 1 grain to breed ${type}`)
            }
          }
          choices.push('Skip')
          return choices
        }, {
          title: `${card.name}: Pay grain to breed animals?`,
          min: 1,
          max: 1,
        })

        if (selection[0] !== 'Skip') {
          const match = selection[0].match(/breed (\w+)/)
          if (match) {
            const animalType = match[1]
            if (player.grain >= 1) {
              player.payCost({ grain: 1 })
            }
            else {
              const field = player.getFieldSpaces().find(f => f.crop === 'grain' && f.cropCount > 0)
              const space = player.getSpace(field.row, field.col)
              space.cropCount -= 1
              if (space.cropCount === 0) {
                space.crop = null
              }
            }
            game.actions.handleAnimalPlacement(player, { [animalType]: 1 })
            game.log.add({
              template: '{player} pays 1 grain to breed {animal} using {card}',
              args: { player, animal: animalType, card },
            })
          }
        }
      }
    }
  },
}
