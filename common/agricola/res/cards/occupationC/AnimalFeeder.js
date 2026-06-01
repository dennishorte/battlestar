module.exports = {
  id: "animal-feeder-c138",
  name: "Animal Feeder",
  deck: "occupationC",
  number: 138,
  type: "occupation",
  players: "3+",
  text: "On the \"Day Laborer\" action space, you also get your choice of 1 sheep or 1 grain. Instead of that good, you can buy 1 wild boar for 1 food or 1 cattle for 2 food.",
  matches_onAction(game, player, actionId) {
    return actionId === 'day-laborer'
  },
  onAction(game, player, _actionId) {
    const choices = [
      game.actions.option({ id: 'sheep', title: '1 sheep' }),
      game.actions.option({ id: 'grain', title: '1 grain' }),
    ]
    if (player.food >= 1) {
      choices.push(game.actions.option({ id: 'boar', title: 'Pay 1 food for 1 wild boar' }))
    }
    if (player.food >= 2) {
      choices.push(game.actions.option({ id: 'cattle', title: 'Pay 2 food for 1 cattle' }))
    }
    const selection = game.actions.choose(player, () => choices, { title: 'Animal Feeder', min: 1, max: 1 })
    if (selection[0].id === 'sheep') {
      game.actions.handleAnimalPlacement(player, { sheep: 1 })
      game.log.add({ template: '{player} gets 1 sheep', args: { player } })
    }
    else if (selection[0].id === 'grain') {
      player.addResource('grain', 1)
      game.log.add({ template: '{player} gets 1 grain', args: { player } })
    }
    else if (selection[0].id === 'boar') {
      player.payCost({ food: 1 })
      game.actions.handleAnimalPlacement(player, { boar: 1 })
      game.log.add({ template: '{player} buys 1 wild boar', args: { player } })
    }
    else if (selection[0].id === 'cattle') {
      player.payCost({ food: 2 })
      game.actions.handleAnimalPlacement(player, { cattle: 1 })
      game.log.add({ template: '{player} buys 1 cattle', args: { player } })
    }
  },
}
