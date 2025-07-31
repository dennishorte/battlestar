module.exports = {
  name: `Paper`,
  color: `green`,
  age: 3,
  expansion: `base`,
  biscuits: `hssc`,
  dogmaBiscuit: `s`,
  dogma: [
    `You may splay your green or blue cards left.`,
    `Draw a {4} for every color you have splayed left.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.aChooseAndSplay(player, ['green', 'blue'], 'left')
    },

    (game, player, { self }) => {
      const splayedLeftCount = game
        .util.colors()
        .map(color => game.zones.byPlayer(player, color))
        .filter(zone => zone.splay === 'left')
        .length

      for (let i = 0; i < splayedLeftCount; i++) {
        game.actions.draw(player, { age: game.getEffectAge(self, 4) })
      }
    },
  ],
}
