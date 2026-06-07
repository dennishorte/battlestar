module.exports = {
  id: "stone-sculptor-e153",
  name: "Stone Sculptor",
  deck: "occupationE",
  number: 153,
  type: "occupation",
  players: "4+",
  text: "Each harvest, you can use this card to exchange exactly 1 stone for 1 bonus point and 1 food.",
  matches_onHarvest(_game, player) {
    return player.stone >= 1
  },
  onHarvest(game, player) {
    const selection = game.actions.choose(player, [
      game.actions.option({ id: 'convert', title: 'Convert 1 stone to 1 VP + 1 food' }),
      game.actions.option({ id: 'skip', title: 'Skip' }),
    ], {
      title: 'Stone Sculptor: Convert?',
      min: 1,
      max: 1,
    })
    if (selection[0].id !== 'skip') {
      player.removeResource('stone', 1)
      player.addBonusPoints(1)
      player.addResource('food', 1)
      game.log.add({
        template: '{player} converts 1 stone to 1 VP and 1 food',
        args: { player },
      })
    }
  },
}
