module.exports = {
  name: 'Supremacy',
  shortName: 'supr',
  expansion: 'echo',
  text: 'Have three or more of one biscuit in four colors.',
  alt: 'Novel',
  isSpecialAchievement: true,
  checkPlayerIsEligible: function(game, player, reduceCost) {
    const targetBiscuitCount = reduceCost ? 2 : 3
    const targetColorsCount = reduceCost ? 3 : 4

    const colorCounts = game.utilEmptyBiscuits()
    for (const color of game.utilColors()) {
      const zone = game.getZoneByPlayer(player, color)
      const biscuits = game.getBiscuitsByZone(zone)
      for (const biscuit of Object.keys(colorCounts)) {
        if (biscuits[biscuit] >= targetBiscuitCount) {
          colorCounts[biscuit] += 1
        }
      }
    }
    return Object.values(colorCounts).some(count => count >= targetColorsCount)
  },
}
