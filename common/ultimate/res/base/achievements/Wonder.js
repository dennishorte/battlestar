module.exports = {
  name: 'Wonder',
  shortName: 'wond',
  expansion: 'base',
  text: 'Have five colors splayed either right, up, or aslant.',
  alt: 'Invention',
  isSpecialAchievement: true,
  checkPlayerIsEligible: function(game, player, reduceCost) {
    const numColors = reduceCost ? 4 : 5
    const splays = game
      .util.colors()
      .map(c => game.zones.byPlayer(player, c).splay)

    const directionMatch = splays
      .filter(splay => splay === 'right' || splay === 'up' || splay === 'aslant')
      .length

    return directionMatch >= numColors
  },
}
