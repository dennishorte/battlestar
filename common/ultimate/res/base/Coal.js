module.exports = {
  name: `Coal`,
  color: `red`,
  age: 5,
  expansion: `base`,
  biscuits: `fffh`,
  dogmaBiscuit: `f`,
  dogma: [
    `Draw and tuck a {5}.`,
    `You may splay your red cards right.`,
    `You may choose a color. If you do, score your top card, twice.`,
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.actions.drawAndTuck(player, game.getEffectAge(self, 5))
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['red'], 'right')
    },

    (game, player) => {
      const validColors = game.cards.tops(player).map(c => c.color)
      const color = game.actions.choose(player, validColors, {
        title: 'Choose a color to score, twice',
        min: 0,
        max: 1,
      })[0]

      if (color) {
        for (let i = 0; i < 2; i++) {
          const toScore = game.cards.byPlayer(player, color)[0]
          if (toScore) {
            game.actions.score(player, toScore)
          }
        }
      }
      else {
        game.log.addDoNothing(player, 'score')
      }
    },
  ],
}
