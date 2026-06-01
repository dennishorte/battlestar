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
        choices.push(game.actions.option({ id: 'wood', title: 'Buy 1 wood for 1 food' }))
        choices.push(game.actions.option({ id: 'clay', title: 'Buy 1 clay for 1 food' }))
      }
      if (player.food >= 2) {
        choices.push(game.actions.option({ id: 'reed', title: 'Buy 1 reed for 2 food' }))
        choices.push(game.actions.option({ id: 'stone', title: 'Buy 1 stone for 2 food' }))
      }
      choices.push(game.actions.option({ id: 'skip', title: 'Skip' }))

      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Buy building resource after harvest?`,
        min: 1,
        max: 1,
      })

      const choiceId = selection[0].id
      if (choiceId === 'wood') {
        player.payCost({ food: 1 })
        player.addResource('wood', 1)
      }
      else if (choiceId === 'clay') {
        player.payCost({ food: 1 })
        player.addResource('clay', 1)
      }
      else if (choiceId === 'reed') {
        player.payCost({ food: 2 })
        player.addResource('reed', 1)
      }
      else if (choiceId === 'stone') {
        player.payCost({ food: 2 })
        player.addResource('stone', 1)
      }

      if (choiceId !== 'skip') {
        game.log.add({
          template: '{player} buys 1 {resource} via {card}',
          args: { player, resource: choiceId, card: card },
        })
      }
    }
  },
}
