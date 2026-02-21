module.exports = {
  id: "soil-scientist-c114",
  name: "Soil Scientist",
  deck: "occupationC",
  number: 114,
  type: "occupation",
  players: "1+",
  text: "Each time after you use a clay/stone accumulation space, you can place 1 stone/2 clay from your supply on the space to get 2 grain/1 vegetable, respectively.",
  onAction(game, player, actionId) {
    if ((actionId === 'take-clay' || actionId === 'take-clay-2') && player.stone >= 1) {
      const selection = game.actions.choose(player, () => [
        'Place 1 stone on space for 2 grain',
        'Skip',
      ], { title: 'Soil Scientist', min: 1, max: 1 })
      if (selection[0] !== 'Skip') {
        player.payCost({ stone: 1 })
        player.addResource('grain', 2)
        game.log.add({
          template: '{player} exchanges 1 stone for 2 grain from {card}',
          args: { player , card: this},
        })
      }
    }
    else if ((actionId === 'take-stone-1' || actionId === 'take-stone-2') && player.clay >= 2) {
      const selection = game.actions.choose(player, () => [
        'Place 2 clay on space for 1 vegetable',
        'Skip',
      ], { title: 'Soil Scientist', min: 1, max: 1 })
      if (selection[0] !== 'Skip') {
        player.payCost({ clay: 2 })
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} exchanges 2 clay for 1 vegetable from {card}',
          args: { player , card: this},
        })
      }
    }
  },
}
