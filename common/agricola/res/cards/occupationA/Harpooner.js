module.exports = {
  id: "harpooner-a138",
  name: "Harpooner",
  deck: "occupationA",
  number: 138,
  type: "occupation",
  players: "3+",
  text: "Each time you use the \"Fishing\" accumulation space you can also pay 1 wood to get 1 food for each person you have, and 1 reed.",
  onAction(game, player, actionId) {
    if (actionId === 'fishing' && player.wood >= 1) {
      const card = this
      const foodBonus = player.familyMembers
      const choices = [`Pay 1 wood for ${foodBonus} food and 1 reed`, 'Skip']
      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Pay wood for bonus?`,
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.payCost({ wood: 1 })
        player.addResource('food', foodBonus)
        player.addResource('reed', 1)
        game.log.add({
          template: '{player} pays 1 wood for {food} food and 1 reed using {card}',
          args: { player, food: foodBonus, card },
        })
      }
    }
  },
}
