module.exports = {
  id: "timber-shingle-maker-c132",
  name: "Timber Shingle Maker",
  deck: "occupationC",
  number: 132,
  type: "occupation",
  players: "1+",
  text: "When you renovate to stone, you can place up to 1 wood from your supply in each of your rooms. During scoring, each such wood is worth 1 bonus point.",
  onRenovate(game, player, fromType, toType) {
    if (toType === 'stone' && player.wood > 0) {
      game.actions.offerTimberShingleMakerPlacement(player, this)
    }
  },
  getEndGamePoints(player) {
    return player.timberShingleMakerWood || 0
  },
}
