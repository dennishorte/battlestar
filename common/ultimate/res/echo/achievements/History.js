module.exports = {
  name: 'History',
  shortName: 'hist',
  expansion: 'echo',
  text: 'Have four echo effects visible in one color.',
  alt: 'Photography',
  isSpecialAchievement: true,
  checkPlayerIsEligible: function(game, player, reduceCost) {
    const targetCount = reduceCost ? 3 : 4

    const infos = game.getInfoByKarmaTrigger(player, 'hex-effect')

    // Stephen Hawking converts all hexes to echo effects.
    const includeHexesAsEcho = (card) => (
      infos.some(info => info.impl.matches(game, player, { card }))
    )

    return game
      // Grab each stack
      .util.colors()
      .map(color => game.zones.byPlayer(player, color))

      // Convert each stack to a count of echo effects
      .map(zone => zone
        .cardlist()
        .flatMap(card => {
          if (includeHexesAsEcho(card)) {
            return card.checkBiscuitIsVisible('&') || card.checkBiscuitIsVisible('h')
          }
          else {
            return card.checkBiscuitIsVisible('&')
          }
        })
        .filter(bool => bool)
        .length
      )
      .some(count => count >= targetCount)
  },
}
