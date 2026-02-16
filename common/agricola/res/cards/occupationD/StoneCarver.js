module.exports = {
  id: "stone-carver-d108",
  name: "Stone Carver",
  deck: "occupationD",
  number: 108,
  type: "occupation",
  players: "1+",
  text: "Each harvest, you can use this card to turn exactly 1 stone into 3 food.",
  onHarvest(game, player) {
    if (player.stone >= 1) {
      const choices = ['Convert 1 stone to 3 food', 'Skip']
      const selection = game.actions.choose(player, choices, {
        title: 'Stone Carver',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.stone -= 1
        player.addResource('food', 3)
        game.log.add({
          template: '{player} converts 1 stone to 3 food (Stone Carver)',
          args: { player },
        })
      }
    }
  },
}
