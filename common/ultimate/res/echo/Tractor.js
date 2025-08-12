module.exports = {
  name: `Tractor`,
  color: `yellow`,
  age: 8,
  expansion: `echo`,
  biscuits: `&iih`,
  dogmaBiscuit: `i`,
  echo: `Draw a {7}.`,
  dogma: [
    `Draw and score a {7}. Draw a {7}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.actions.drawAndScore(player, game.getEffectAge(self, 7))
      game.actions.draw(player, { age: game.getEffectAge(self, 7) })
    }
  ],
  echoImpl: (game, player, { self }) => {
    game.actions.draw(player, { age: game.getEffectAge(self, 7) })
  },
}
