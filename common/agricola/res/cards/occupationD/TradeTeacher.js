module.exports = {
  id: "trade-teacher-d137",
  name: "Trade Teacher",
  deck: "occupationD",
  number: 137,
  type: "occupation",
  players: "1+",
  text: "Each time after you use a \"Lesson\" action space, you can buy up to 2 different goods: grain, stone, sheep, and wild boar for 1 food each; cattle and vegetable for 2 food each.",
  matches_onAction(game, player, actionId) {
    return actionId === 'occupation' || (typeof actionId === 'string' && actionId.startsWith('lessons-'))
  },
  onAction(game, player, _actionId) {
    if (player.food < 1) {
      return
    }
    for (let purchase = 0; purchase < 2; purchase++) {
      if (player.food < 1) {
        break
      }
      const choices = []
      if (player.food >= 1) {
        choices.push(game.actions.option({ id: 'grain', title: 'Buy 1 grain for 1 food' }))
        choices.push(game.actions.option({ id: 'stone', title: 'Buy 1 stone for 1 food' }))
        choices.push(game.actions.option({ id: 'sheep', title: 'Buy 1 sheep for 1 food' }))
        choices.push(game.actions.option({ id: 'boar', title: 'Buy 1 boar for 1 food' }))
      }
      if (player.food >= 2) {
        choices.push(game.actions.option({ id: 'cattle', title: 'Buy 1 cattle for 2 food' }))
        choices.push(game.actions.option({ id: 'vegetable', title: 'Buy 1 vegetable for 2 food' }))
      }
      choices.push(game.actions.option({ id: 'skip', title: 'Skip' }))
      const selection = game.actions.choose(player, choices, {
        title: `Trade Teacher (purchase ${purchase + 1} of 2)`,
        min: 1,
        max: 1,
      })
      if (selection[0].id === 'skip') {
        break
      }
      const resource = selection[0].id
      const cost = (resource === 'cattle' || resource === 'vegetable') ? 2 : 1
      player.removeResource('food', cost)
      if (resource === 'sheep' || resource === 'boar' || resource === 'cattle') {
        game.actions.handleAnimalPlacement(player, { [resource]: 1 })
      }
      else {
        player.addResource(resource, 1)
      }
      game.log.add({
        template: '{player} buys 1 {resource} for {cost} food',
        args: { player, resource, cost },
      })
    }
  },
}
