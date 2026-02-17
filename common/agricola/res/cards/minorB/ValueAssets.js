module.exports = {
  id: "value-assets-b082",
  name: "Value Assets",
  deck: "minorB",
  number: 82,
  type: "minor",
  cost: {},
  category: "Building Resource Provider",
  text: "After each harvest, you can buy exactly one of the following building resources: 1 food → 1 wood; 1 food → 1 clay; 2 food → 1 reed; 2 food → 1 stone.",
  onHarvestEnd(game, player) {
    if (player.food >= 1) {
      const card = this
      const choices = []
      if (player.food >= 1) {
        choices.push('Buy 1 wood for 1 food')
        choices.push('Buy 1 clay for 1 food')
      }
      if (player.food >= 2) {
        choices.push('Buy 1 reed for 2 food')
        choices.push('Buy 1 stone for 2 food')
      }
      choices.push('Skip')

      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Buy building resource after harvest?`,
        min: 1,
        max: 1,
      })

      if (selection[0] === 'Buy 1 wood for 1 food') {
        player.payCost({ food: 1 })
        player.addResource('wood', 1)
      }
      else if (selection[0] === 'Buy 1 clay for 1 food') {
        player.payCost({ food: 1 })
        player.addResource('clay', 1)
      }
      else if (selection[0] === 'Buy 1 reed for 2 food') {
        player.payCost({ food: 2 })
        player.addResource('reed', 1)
      }
      else if (selection[0] === 'Buy 1 stone for 2 food') {
        player.payCost({ food: 2 })
        player.addResource('stone', 1)
      }

      if (selection[0] !== 'Skip') {
        const resource = selection[0].match(/Buy 1 (\w+)/)[1]
        game.log.add({
          template: '{player} buys 1 {resource} via {card}',
          args: { player, resource, card: card },
        })
      }
    }
  },
}
