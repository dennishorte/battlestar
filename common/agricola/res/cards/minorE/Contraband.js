module.exports = {
  id: "contraband-e054",
  name: "Contraband",
  deck: "minorE",
  number: 54,
  type: "minor",
  cost: { food: 1 },
  text: "Each time you play or build an improvement after this, you can pay 1 additional building resource of a type in the printed cost to get 3 food.",
  onBuildImprovement(game, player, cost, card) {
    if (card.id !== this.id && card.cost) {
      // Find building resources in the card's printed cost
      const buildingResources = ['wood', 'clay', 'stone', 'reed']
      const resourcesInCost = buildingResources.filter(r => card.cost[r] > 0 && player[r] >= 1)
      if (resourcesInCost.length > 0) {
        const choices = resourcesInCost.map(r => `Pay 1 ${r} for 3 food`)
        choices.push('Skip')
        const selection = game.actions.choose(player, choices, {
          title: 'Contraband',
          min: 1,
          max: 1,
        })
        if (selection[0] !== 'Skip') {
          const resource = selection[0].match(/Pay 1 (\w+)/)[1]
          player.payCost({ [resource]: 1 })
          player.addResource('food', 3)
          game.log.add({
            template: '{player} pays 1 {resource} for 3 food using {card}',
            args: { player, resource, card: this },
          })
        }
      }
    }
  },
}
