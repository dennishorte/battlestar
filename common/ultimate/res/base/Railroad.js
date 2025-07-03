module.exports = {
  name: `Railroad`,
  color: `purple`,
  age: 7,
  expansion: `base`,
  biscuits: `ifih`,
  dogmaBiscuit: `i`,
  dogma: [
    `Return all cards from your hand`,
    `Draw three {6}.`,
    `You may splay up any one color of your cards current splayed right.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
    },

    (game, player, { self }) => {
      game.aDraw(player, { age: game.getEffectAge(self, 6) })
      game.aDraw(player, { age: game.getEffectAge(self, 6) })
      game.aDraw(player, { age: game.getEffectAge(self, 6) })
    },

    (game, player) => {
      const choices = game
        .utilColors()
        .filter(color => game.getZoneByPlayer(player, color).splay === 'right')
      game.aChooseAndSplay(player, choices, 'up')
    }
  ],
}
