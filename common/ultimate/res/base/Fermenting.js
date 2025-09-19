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
        .util.colors()
        .map(color => game.zones.byPlayer(player, color))
        .filter(zone => zone.biscuits().l > 0)
        .length

      for (let i = 0; i < count; i++) {
        game.actions.draw(player, { age: game.getEffectAge(self, 2) })
      }
    }
  ],
}
