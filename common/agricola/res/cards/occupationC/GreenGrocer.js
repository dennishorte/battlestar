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
      choices.push(game.actions.option({ id: 'cattle-to-veg', title: 'Exchange 1 cattle for 1 vegetable' }))
    }
    if (player.vegetables >= 1) {
      choices.push(game.actions.option({ id: 'veg-to-cattle', title: 'Exchange 1 vegetable for 1 cattle' }))
    }
    if (player.getTotalAnimals('sheep') >= 2) {
      choices.push(game.actions.option({ id: 'sheep-to-veg', title: 'Exchange 2 sheep for 1 vegetable' }))
    }
    if (player.vegetables >= 1) {
      choices.push(game.actions.option({ id: 'veg-to-sheep', title: 'Exchange 1 vegetable for 2 sheep' }))
    }
    if (player.food >= 2) {
      choices.push(game.actions.option({ id: 'food-to-grain', title: 'Exchange 2 food for 1 grain' }))
    }
    if (player.grain >= 1) {
      choices.push(game.actions.option({ id: 'grain-to-food', title: 'Exchange 1 grain for 2 food' }))
    }
    choices.push(game.actions.option({ id: 'skip', title: 'Skip' }))

    if (choices.length > 1) {
      const selection = game.actions.choose(player, () => choices, { title: 'Green Grocer', min: 1, max: 1 })
      const id = selection[0].id
      if (id === 'cattle-to-veg') {
        player.removeAnimals('cattle', 1)
        player.addResource('vegetables', 1)
      }
      else if (id === 'veg-to-cattle') {
        player.payCost({ vegetables: 1 })
        game.actions.handleAnimalPlacement(player, { cattle: 1 })
      }
      else if (id === 'sheep-to-veg') {
        player.removeAnimals('sheep', 2)
        player.addResource('vegetables', 1)
      }
      else if (id === 'veg-to-sheep') {
        player.payCost({ vegetables: 1 })
        game.actions.handleAnimalPlacement(player, { sheep: 2 })
      }
      else if (id === 'food-to-grain') {
        player.payCost({ food: 2 })
        player.addResource('grain', 1)
      }
      else if (id === 'grain-to-food') {
        player.payCost({ grain: 1 })
        player.addResource('food', 2)
      }
      if (id !== 'skip') {
        game.log.add({
          template: '{player} uses {card}: {choice}',
          args: { player, choice: selection[0].title, card: this },
        })
      }
    }
  },
}
