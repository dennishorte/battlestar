module.exports = {
  id: "schnapps-distiller-c109",
  name: "Schnapps Distiller",
  deck: "occupationC",
  number: 109,
  type: "occupation",
  players: "1+",
  text: "In the feeding phase of each harvest, you can use this card to turn exactly 1 vegetable into 5 food.",
  onFeedingPhase(game, player) {
    if (player.vegetables >= 1) {
      const selection = game.actions.choose(player, () => [
        'Convert 1 vegetable to 5 food',
        'Skip',
      ], { title: 'Schnapps Distiller', min: 1, max: 1 })
      if (selection[0] !== 'Skip') {
        player.payCost({ vegetables: 1 })
        player.addResource('food', 5)
        game.log.add({
          template: '{player} converts 1 vegetable to 5 food via Schnapps Distiller',
          args: { player },
        })
      }
    }
  },
}
