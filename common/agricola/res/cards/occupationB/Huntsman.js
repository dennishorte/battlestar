module.exports = {
  id: "huntsman-b147",
  name: "Huntsman",
  deck: "occupationB",
  number: 147,
  type: "occupation",
  players: "3+",
  text: "Each time after you use a wood accumulation space, you can pay 1 grain to get 1 wild boar.",
  onAction(game, player, actionId) {
    const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
    if (woodActions.includes(actionId) && player.grain >= 1 && player.canPlaceAnimals('boar', 1)) {
      game.actions.offerHuntsmanBoar(player, this)
    }
  },
}
