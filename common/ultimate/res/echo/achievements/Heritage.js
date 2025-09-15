module.exports = {
  name: 'Heritage',
  shortName: 'hrtg',
  expansion: 'echo',
  text: 'Have eight visible hexes in one color.',
  alt: 'Loom',
  isSpecialAchievement: true,
  checkPlayerIsEligible: function(game, player, reduceCost) {
    const targetCount = reduceCost ? 7 : 8
    return game
      // Grab each stack
      .util.colors()
      .map(color => game.zones.byPlayer(player, color))

      // Convert each stack to a count of hexes
      .map(zone => zone
        .cardlist()
        .map(c => (game.getBiscuitsRaw(c, zone.splay).match(/[hm]/g) || []).length )
        .reduce((prev, curr) => prev + curr, 0)
      )
      .some(count => count >= targetCount)
  },
}
