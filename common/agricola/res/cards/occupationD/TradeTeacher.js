module.exports = {
  id: "trade-teacher-d137",
  name: "Trade Teacher",
  deck: "occupationD",
  number: 137,
  type: "occupation",
  players: "1+",
  text: "Each time after you use a \"Lesson\" action space, you can buy up to 2 different goods: grain, stone, sheep, and wild boar for 1 food each; cattle and vegetable for 2 food each.",
  onAction(game, player, actionId) {
    const isLessonsAction = actionId === 'occupation' || (typeof actionId === 'string' && actionId.startsWith('lessons-'))
    if (!isLessonsAction) {
      return
    }
    if (player.food < 1) {
      return
    }
    for (let purchase = 0; purchase < 2; purchase++) {
      if (player.food < 1) {
        break
      }
      const choices = []
      if (player.food >= 1) {
        choices.push('Buy 1 grain for 1 food')
        choices.push('Buy 1 stone for 1 food')
        choices.push('Buy 1 sheep for 1 food')
        choices.push('Buy 1 boar for 1 food')
      }
      if (player.food >= 2) {
        choices.push('Buy 1 cattle for 2 food')
        choices.push('Buy 1 vegetable for 2 food')
      }
      choices.push('Skip')
      const selection = game.actions.choose(player, choices, {
        title: `Trade Teacher (purchase ${purchase + 1} of 2)`,
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Skip') {
        break
      }
      const match = selection[0].match(/Buy 1 (\w+) for (\d+) food/)
      const resource = match[1]
      const cost = parseInt(match[2])
      player.removeResource('food', cost)
      if (resource === 'sheep' || resource === 'boar' || resource === 'cattle') {
        game.actions.handleAnimalPlacement(player, { [resource]: 1 })
      }
      else {
        player.addResource(resource, 1)
      }
      game.log.add({
        template: '{player} buys 1 {resource} for {cost} food ({card})',
        args: { player, resource, cost , card: this},
      })
    }
  },
}
