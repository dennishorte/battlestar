module.exports = function() {
  this.id = 'Heritage'
  this.name = 'Heritage'
  this.exp = 'echo'
  this.text = 'Have eight visible hexes in one color.'
  this.alt = 'Loom'
  this.checkPlayerIsEligible = function(game, player) {
    return game
      // Grab each stack
      .utilColors()
      .map(color => game.getZoneColorByPlayer(player, color))

      // Convert each stack to a count of hexes
      .map(zone => zone
        .cards
        .map(c => (game.getBiscuitsRaw(c, zone.splay).match(/h/g) || []).length )
        .reduce((prev, curr) => prev + curr, 0)
      )
      .some(count => count >= 8)
  }
}
