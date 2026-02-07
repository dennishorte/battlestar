module.exports = {
  id: "shifting-cultivator-a091",
  name: "Shifting Cultivator",
  deck: "occupationA",
  number: 91,
  type: "occupation",
  players: "1+",
  text: "Each time you use a wood accumulation space, you can also pay 3 food to plow 1 field.",
  onAction(game, player, actionId) {
    const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
    if (woodActions.includes(actionId) && player.food >= 3) {
      game.offerPlowForFood(player, this, 3)
    }
  },
}
