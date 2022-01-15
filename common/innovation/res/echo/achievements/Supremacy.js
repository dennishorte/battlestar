module.exports = function() {
  this.id = 'Supremacy'
  this.name = 'Supremacy'
  this.exp = 'echo'
  this.text = 'Have three or more of one biscuit in four colors.'
  this.alt = 'Novel'
  this.checkPlayerIsEligible = function(game, player) {
    const colorCounts = game.utilEmptyBiscuits()
    for (const color of game.utilColors()) {
      const zone = game.getZoneColorByPlayer(player, color)
      const biscuits = game.getBiscuitsInZone(zone)
      for (const biscuit of Object.keys(colorCounts)) {
        if (biscuits[biscuit] >= 3) {
          colorCounts[biscuit] += 1
        }
      }
    }
    return Object.values(colorCounts).some(count => count >= 4)
  }
}
