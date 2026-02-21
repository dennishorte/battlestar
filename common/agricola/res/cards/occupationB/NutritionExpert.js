module.exports = {
  id: "nutrition-expert-b135",
  name: "Nutrition Expert",
  deck: "occupationB",
  number: 135,
  type: "occupation",
  players: "1+",
  text: "At the start of each round, you can exchange a set comprised of 1 animal of any type, 1 grain, and 1 vegetable for 5 food and 2 bonus points.",
  onRoundStart(game, player) {
    const hasAnimal = player.getTotalAnimals('sheep') >= 1 || player.getTotalAnimals('boar') >= 1 || player.getTotalAnimals('cattle') >= 1
    if (player.grain >= 1 && player.vegetables >= 1 && hasAnimal) {
      const choices = ['Exchange 1 animal + 1 grain + 1 vegetable for 5 food + 2 BP', 'Skip']
      const selection = game.actions.choose(player, choices, {
        title: 'Nutrition Expert: Exchange set for food and points?',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        // Choose which animal to give up
        const animalTypes = []
        if (player.getTotalAnimals('sheep') >= 1) {
          animalTypes.push('sheep')
        }
        if (player.getTotalAnimals('boar') >= 1) {
          animalTypes.push('boar')
        }
        if (player.getTotalAnimals('cattle') >= 1) {
          animalTypes.push('cattle')
        }

        let animalType
        if (animalTypes.length === 1) {
          animalType = animalTypes[0]
        }
        else {
          const animalChoices = animalTypes.map(a => `Give 1 ${a}`)
          const animalSelection = game.actions.choose(player, animalChoices, {
            title: 'Nutrition Expert: Which animal?',
            min: 1,
            max: 1,
          })
          animalType = animalTypes.find(a => animalSelection[0].includes(a))
        }
        player.removeAnimals(animalType, 1)
        player.payCost({ grain: 1, vegetables: 1 })
        player.addResource('food', 5)
        player.addBonusPoints(2)
        game.log.add({
          template: '{player} exchanges 1 {animal}, 1 grain, 1 vegetable for 5 food and 2 BP from {card}',
          args: { player, animal: animalType , card: this},
        })
      }
    }
  },
}
