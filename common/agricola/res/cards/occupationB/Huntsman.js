module.exports = {
  id: "huntsman-b147",
  name: "Huntsman",
  deck: "occupationB",
  number: 147,
  type: "occupation",
  players: "3+",
  text: "Each time after you use a wood accumulation space, you can pay 1 grain to get 1 wild boar.",
  onAction(game, player, actionId) {
    const woodActions = ['take-wood', 'copse', 'copse-5', 'grove', 'grove-5', 'grove-6']
    if (woodActions.includes(actionId) && player.grain >= 1 && player.canPlaceAnimals('boar', 1)) {
      const choices = ['Pay 1 grain for 1 boar', 'Skip']
      const selection = game.actions.choose(player, choices, {
        title: 'Huntsman: Pay 1 grain for 1 boar?',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.payCost({ grain: 1 })
        game.actions.handleAnimalPlacement(player, { boar: 1 })
        game.log.add({
          template: '{player} pays 1 grain for 1 boar from {card}',
          args: { player , card: this},
        })
      }
    }
  },
}
