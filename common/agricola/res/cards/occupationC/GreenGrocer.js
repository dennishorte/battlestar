module.exports = {
  id: "green-grocer-c103",
  name: "Green Grocer",
  deck: "occupationC",
  number: 103,
  type: "occupation",
  players: "1+",
  text: "At the start of each round, you can make exactly one exchange: 1 Cattle/Vegetable for 1 Vegetable/Cattle; 2 Sheep for 1 Vegetable; 1 Vegetable for 2 Sheep; 2 Food for 1 Grain; 1 Grain for 2 Food.",
  onRoundStart(game, player) {
    const choices = []
    if (player.getTotalAnimals('cattle') >= 1) {
      choices.push('Exchange 1 cattle for 1 vegetable')
    }
    if (player.vegetables >= 1) {
      choices.push('Exchange 1 vegetable for 1 cattle')
    }
    if (player.getTotalAnimals('sheep') >= 2) {
      choices.push('Exchange 2 sheep for 1 vegetable')
    }
    if (player.vegetables >= 1) {
      choices.push('Exchange 1 vegetable for 2 sheep')
    }
    if (player.food >= 2) {
      choices.push('Exchange 2 food for 1 grain')
    }
    if (player.grain >= 1) {
      choices.push('Exchange 1 grain for 2 food')
    }
    choices.push('Skip')

    if (choices.length > 1) {
      const selection = game.actions.choose(player, () => choices, { title: 'Green Grocer', min: 1, max: 1 })
      if (selection[0] === 'Exchange 1 cattle for 1 vegetable') {
        player.removeAnimals('cattle', 1)
        player.addResource('vegetables', 1)
      }
      else if (selection[0] === 'Exchange 1 vegetable for 1 cattle') {
        player.payCost({ vegetables: 1 })
        player.addAnimals('cattle', 1)
      }
      else if (selection[0] === 'Exchange 2 sheep for 1 vegetable') {
        player.removeAnimals('sheep', 2)
        player.addResource('vegetables', 1)
      }
      else if (selection[0] === 'Exchange 1 vegetable for 2 sheep') {
        player.payCost({ vegetables: 1 })
        player.addAnimals('sheep', 2)
      }
      else if (selection[0] === 'Exchange 2 food for 1 grain') {
        player.payCost({ food: 2 })
        player.addResource('grain', 1)
      }
      else if (selection[0] === 'Exchange 1 grain for 2 food') {
        player.payCost({ grain: 1 })
        player.addResource('food', 2)
      }
      if (selection[0] !== 'Skip') {
        game.log.add({
          template: '{player} uses {card}: {choice}',
          args: { player, choice: selection[0] , card: this},
        })
      }
    }
  },
}
