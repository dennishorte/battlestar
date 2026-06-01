module.exports = {
  id: "new-purchase-b070",
  name: "New Purchase",
  deck: "minorB",
  number: 70,
  type: "minor",
  cost: {},
  category: "Crop Provider",
  text: "Before the start of each round that ends with a harvest, you can buy one of each of the following crops: 2 food → 1 grain; 4 food → 1 vegetable.",
  onRoundStart(game, player, round) {
    if (game.isHarvestRound(round) && (player.food >= 2)) {
      const card = this
      const choices = []
      if (player.food >= 2) {
        choices.push(game.actions.option({ id: 'grain', title: 'Buy 1 grain for 2 food' }))
      }
      if (player.food >= 4) {
        choices.push(game.actions.option({ id: 'vegetable', title: 'Buy 1 vegetable for 4 food' }))
      }
      choices.push(game.actions.option({ id: 'skip', title: 'Skip' }))

      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Buy crops before harvest?`,
        min: 1,
        max: 1,
      })

      if (selection[0].id === 'grain') {
        player.payCost({ food: 2 })
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} buys 1 grain for 2 food via {card}',
          args: { player, card: card },
        })
        if (player.food >= 4) {
          const selection2 = game.actions.choose(player, [
            game.actions.option({ id: 'vegetable', title: 'Buy 1 vegetable for 4 food' }),
            game.actions.option({ id: 'skip', title: 'Skip' }),
          ], {
            title: `${card.name}: Also buy vegetable?`,
            min: 1,
            max: 1,
          })
          if (selection2[0].id !== 'skip') {
            player.payCost({ food: 4 })
            player.addResource('vegetables', 1)
            game.log.add({
              template: '{player} buys 1 vegetable for 4 food via {card}',
              args: { player, card: card },
            })
          }
        }
      }
      else if (selection[0].id === 'vegetable') {
        player.payCost({ food: 4 })
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} buys 1 vegetable for 4 food via {card}',
          args: { player, card: card },
        })
        if (player.food >= 2) {
          const selection2 = game.actions.choose(player, [
            game.actions.option({ id: 'grain', title: 'Buy 1 grain for 2 food' }),
            game.actions.option({ id: 'skip', title: 'Skip' }),
          ], {
            title: `${card.name}: Also buy grain?`,
            min: 1,
            max: 1,
          })
          if (selection2[0].id !== 'skip') {
            player.payCost({ food: 2 })
            player.addResource('grain', 1)
            game.log.add({
              template: '{player} buys 1 grain for 2 food via {card}',
              args: { player, card: card },
            })
          }
        }
      }
    }
  },
}
