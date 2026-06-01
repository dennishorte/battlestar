module.exports = {
  id: "cooking-hearth-extension-c062",
  name: "Cooking Hearth Extension",
  deck: "minorC",
  number: 62,
  type: "minor",
  cost: { clay: 2 },
  category: "Food Provider",
  text: "Each harvest, you can use each of your cooking improvements once to get double the amount of food for 1 animal or vegetable.",
  matches_onHarvest(game, player) {
    return player.majorImprovements.some(id => {
      const imp = game.cards.byId(id)
      return imp && imp.cookingRates
    })
  },
  onHarvest(game, player) {
    const cookingImps = []
    for (const id of player.majorImprovements) {
      const imp = game.cards.byId(id)
      if (imp && imp.cookingRates) {
        cookingImps.push(imp)
      }
    }

    for (const imp of cookingImps) {
      const rates = imp.cookingRates
      const options = []
      const animals = player.getAllAnimals()

      for (const [type, count] of Object.entries(animals)) {
        if (count > 0 && rates[type]) {
          options.push(game.actions.option({ id: type, title: `Cook 1 ${type} for ${rates[type] * 2} food` }))
        }
      }
      if (player.vegetables > 0 && rates.vegetables) {
        options.push(game.actions.option({ id: 'vegetables', title: `Cook 1 vegetable for ${rates.vegetables * 2} food` }))
      }

      if (options.length === 0) {
        continue
      }

      options.push(game.actions.option({ id: 'skip', title: 'Skip' }))

      const selection = game.actions.choose(player, options, {
        title: `Cooking Hearth Extension: Use ${imp.name} for double food`,
        min: 1, max: 1,
      })

      const choice = selection[0].id
      if (choice === 'skip') {
        continue
      }

      if (choice === 'sheep') {
        player.removeAnimals('sheep', 1)
        player.addResource('food', rates.sheep * 2)
      }
      else if (choice === 'boar') {
        player.removeAnimals('boar', 1)
        player.addResource('food', rates.boar * 2)
      }
      else if (choice === 'cattle') {
        player.removeAnimals('cattle', 1)
        player.addResource('food', rates.cattle * 2)
      }
      else if (choice === 'vegetables') {
        player.removeResource('vegetables', 1)
        player.addResource('food', rates.vegetables * 2)
      }

      game.log.add({
        template: '{player} uses {imp} for double food',
        args: { player, imp: imp.name },
      })
    }
  },
}
