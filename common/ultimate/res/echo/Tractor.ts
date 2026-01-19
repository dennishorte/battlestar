export default {
  name: `Tractor`,
  color: `yellow`,
  age: 8,
  expansion: `echo`,
  biscuits: `&iih`,
  dogmaBiscuit: `i`,
  echo: `Draw a {7}.`,
  dogma: [
    `Draw and score a {7}.`,
    `Draw a {7}.`,
    `If Tractor was foreseen, draw and score seven {7}.`,
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.actions.drawAndScore(player, game.getEffectAge(self, 7))
    },

    (game, player, { self }) => {
      game.actions.draw(player, { age: game.getEffectAge(self, 7) })
    },

    (game, player, { foreseen, self }) => {
      game.log.addForeseen(foreseen, self)
      if (foreseen) {
        for (let i = 0; i < 7; i++) {
          game.actions.drawAndScore(player, game.getEffectAge(self, 7))
        }
      }
    }
  ],
  echoImpl: (game, player, { self }) => {
    game.actions.draw(player, { age: game.getEffectAge(self, 7) })
  },
}
