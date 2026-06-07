module.exports = {
  id: "ebonist-d155",
  name: "Ebonist",
  deck: "occupationD",
  number: 155,
  type: "occupation",
  players: "4+",
  text: "Each harvest, you can use this card to turn exactly 1 wood into 1 food and 1 grain.",
  matches_onHarvest(_game, player) {
    return player.wood >= 1
  },
  onHarvest(game, player) {
    const choices = [
      game.actions.option({ id: 'convert', title: 'Convert 1 wood to 1 food + 1 grain' }),
      game.actions.option({ id: 'skip', title: 'Skip' }),
    ]
    const selection = game.actions.choose(player, choices, {
      title: 'Ebonist',
      min: 1,
      max: 1,
    })
    if (selection[0].id !== 'skip') {
      player.removeResource('wood', 1)
      player.addResource('food', 1)
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} converts 1 wood to 1 food + 1 grain',
        args: { player },
      })
    }
  },
}
