module.exports = {
  id: "supply-boat-d073",
  name: "Supply Boat",
  deck: "minorD",
  number: 73,
  type: "minor",
  cost: { wood: 1 },
  vps: 1,
  prereqs: { occupations: 1 },
  category: "Crop Provider",
  text: "Each time after you use the \"Fishing\" accumulation space, you can choose to buy 1 grain for 1 food, or 1 vegetable for 3 food.",
  matches_onAction(game, player, actionId) {
    return actionId === 'fishing'
  },
  onAction(game, player, _actionId) {
    if (player.food < 1) {
      return
    }

    const choices = [game.actions.option({ id: 'grain', title: 'Buy 1 grain for 1 food' })]
    if (player.food >= 3) {
      choices.push(game.actions.option({ id: 'vegetable', title: 'Buy 1 vegetable for 3 food' }))
    }
    choices.push(game.actions.option({ id: 'skip', title: 'Skip' }))
    const selection = game.actions.choose(player, choices, {
      title: 'Supply Boat',
      min: 1,
      max: 1,
    })
    if (selection[0].id === 'grain') {
      player.payCost({ food: 1 })
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} buys 1 grain for 1 food',
        args: { player },
      })
    }
    else if (selection[0].id === 'vegetable') {
      player.payCost({ food: 3 })
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} buys 1 vegetable for 3 food',
        args: { player },
      })
    }
  },
}
