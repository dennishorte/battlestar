module.exports = {
  id: "stone-sculptor-e153",
  name: "Stone Sculptor",
  deck: "occupationE",
  number: 153,
  type: "occupation",
  players: "1+",
  text: "Each harvest, you can use this card to exchange exactly 1 stone for 1 bonus point and 1 food.",
  onHarvest(game, player) {
    if (player.stone >= 1) {
      const selection = game.actions.choose(player, ['Convert 1 stone to 1 VP + 1 food', 'Skip'], {
        title: 'Stone Sculptor: Convert?',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.removeResource('stone', 1)
        player.bonusPoints = (player.bonusPoints || 0) + 1
        player.addResource('food', 1)
        game.log.add({
          template: '{player} converts 1 stone to 1 VP and 1 food using Stone Sculptor',
          args: { player },
        })
      }
    }
  },
}
