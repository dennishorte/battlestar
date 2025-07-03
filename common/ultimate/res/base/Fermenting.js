module.exports = {
  name: `Fermenting`,
  color: `yellow`,
  age: 2,
  expansion: `base`,
  biscuits: `llhk`,
  dogmaBiscuit: `l`,
  dogma: [
    `Draw a {2} for every color on your board with one or more {l}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const count = game
        .utilColors()
        .map(color => game.getZoneByPlayer(player, color))
        .filter(zone => game.getBiscuitsByZone(zone).l > 0)
        .length

      for (let i = 0; i < count; i++) {
        game.aDraw(player, { age: game.getEffectAge(self, 2) })
      }
    }
  ],
}
