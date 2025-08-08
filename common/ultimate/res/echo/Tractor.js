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
    (game, player) => {
      game.aDrawAndScore(player, game.getEffectAge(this, 7))
      game.aDraw(player, { age: game.getEffectAge(this, 7) })
    }
  ],
  echoImpl: (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 7) })
  },
}
