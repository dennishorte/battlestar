module.exports = {
  name: `Steganography`,
  color: `purple`,
  age: 2,
  expansion: `usee`,
  biscuits: `hkkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `You may splay left a color on your board with {s}. If you do, safeguard an available achievement of value equal to the number of cards of that color on your board. Otherwise, draw and tuck a {3}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const choices = game
        .utilColors()
        .map(color => game.zones.byPlayer(player, color))
        .filter(zone => game.getBiscuitsByZone(zone).s > 0)
        .map(zone => zone.color)

      const splayed = game.aChooseAndSplay(player, choices, 'left')[0]

      if (splayed) {
        const numCards = game.getCardsByZone(player, splayed).length
        game.aSafeguardAvailableAchievement(player, numCards)
      }
      else {
        game.aDrawAndTuck(player, game.getEffectAge(self, 3))
      }
    },
  ],
}
