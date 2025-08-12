module.exports = {
  name: `GPS`,
  color: `green`,
  age: 10,
  expansion: `echo`,
  biscuits: `chii`,
  dogmaBiscuit: `i`,
  echo: ``,
  dogma: [
    `I demand you return all cards from your forecast!`,
    `Draw and foreshadow three {0}.`,
    `You may splay your yellow cards up.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.returnMany(player, game.cards.byPlayer(player, 'forecast'))
    },

    (game, player, { self }) => {
      game.actions.drawAndForeshadow(player, game.getEffectAge(self, 10))
      game.actions.drawAndForeshadow(player, game.getEffectAge(self, 10))
      game.actions.drawAndForeshadow(player, game.getEffectAge(self, 10))
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['yellow'], 'up')
    },
  ],
  echoImpl: [],
}
