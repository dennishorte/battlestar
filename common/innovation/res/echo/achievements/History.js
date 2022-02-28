module.exports = function() {
  this.id = 'History'
  this.name = 'History'
  this.exp = 'echo'
  this.text = 'Have four echo effects visible in one color.'
  this.alt = 'Photography'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {
    const targetCount = reduceCost ? 3 : 4
    return game
    // Grab each stack
      .utilColors()
      .map(color => game.getZoneByPlayer(player, color))

    // Convert each stack to a count of echo effects
      .map(zone => zone
        .cards()
        .map(c => (game.getBiscuitsRaw(c, zone.splay).match(/&/g) || []).length )
        .reduce((prev, curr) => prev + curr, 0)
      )
      .some(count => count >= targetCount)
  }
}
