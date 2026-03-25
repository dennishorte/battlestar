module.exports = {
  id: "harpooner-a138",
  name: "Harpooner",
  deck: "occupationA",
  number: 138,
  type: "occupation",
  players: "3+",
  text: "Each time you use the \"Fishing\" accumulation space you can also pay 1 wood to get 1 food for each person you have, and 1 reed.",
  matches_onAction(game, player, actionId) {
    return actionId === 'fishing'
  },
  onAction(game, player, _actionId) {
    if (player.wood < 1) {
      return
    }
    const foodBonus = player.familyMembers
    const choices = [`Pay 1 wood for ${foodBonus} food and 1 reed`, 'Skip']
    const selection = game.actions.choose(player, choices, {
      title: `Harpooner: Pay wood for bonus?`,
      min: 1,
      max: 1,
    })
    if (selection[0] !== 'Skip') {
      player.payCost({ wood: 1 })
      player.addResource('food', foodBonus)
      player.addResource('reed', 1)
      game.log.add({
        template: '{player} pays 1 wood for {food} food and 1 reed',
        args: { player, food: foodBonus },
      })
    }
  },
}
