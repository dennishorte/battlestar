module.exports = {
  id: "rocky-terrain-c080",
  name: "Rocky Terrain",
  deck: "minorC",
  number: 80,
  type: "minor",
  cost: { food: 1 },
  category: "Building Resource Provider",
  text: "Each time you plow a field (tile or card), you can also buy 1 stone for 1 food.",
  onPlowField(game, player) {
    if (player.food >= 1) {
      const selection = game.actions.choose(player, [
        game.actions.option({ id: 'buy', title: 'Buy 1 stone for 1 food' }),
        game.actions.option({ id: 'skip', title: 'Skip' }),
      ], {
        title: 'Rocky Terrain',
        min: 1,
        max: 1,
      })
      if (selection[0].id !== 'skip') {
        player.payCost({ food: 1 })
        player.addResource('stone', 1)
        game.log.add({
          template: '{player} buys 1 stone using {card}',
          args: { player, card: this },
        })
      }
    }
  },
}
