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
    `You may splay your yellow cards up.`,
    `Draw three {b}. If GPS was foreseen, foreshadow them.`,
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.returnMany(player, game.cards.byPlayer(player, 'forecast'))
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['yellow'], 'up')
    },

    (game, player, { foreseen, self }) => {
      const drawn = [
        game.actions.draw(player, { age: game.getEffectAge(self, 11) }),
        game.actions.draw(player, { age: game.getEffectAge(self, 11) }),
        game.actions.draw(player, { age: game.getEffectAge(self, 11) }),
      ]

      game.log.addForeseen(foreseen, self)
      if (foreseen) {
        game.actions.foreshadowMany(player, drawn)
      }
    },
  ],
  echoImpl: [],
}
