module.exports = {
  id: "schnapps-distiller-c109",
  name: "Schnapps Distiller",
  deck: "occupationC",
  number: 109,
  type: "occupation",
  players: "1+",
  text: "In the feeding phase of each harvest, you can use this card to turn exactly 1 vegetable into 5 food.",
  matches_onFeedingPhase(_game, player) {
    return player.vegetables >= 1
  },
  onFeedingPhase(game, player) {
    const selection = game.actions.choose(player, () => [
      game.actions.option({ id: 'convert', title: 'Convert 1 vegetable to 5 food' }),
      game.actions.option({ id: 'skip', title: 'Skip' }),
    ], { title: 'Schnapps Distiller', min: 1, max: 1 })
    if (selection[0].id !== 'skip') {
      player.payCost({ vegetables: 1 })
      player.addResource('food', 5)
      game.log.add({
        template: '{player} converts 1 vegetable to 5 food',
        args: { player },
      })
    }
  },
}
