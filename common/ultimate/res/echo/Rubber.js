module.exports = {
  name: `Rubber`,
  color: `red`,
  age: 7,
  expansion: `echo`,
  biscuits: `h&f7`,
  dogmaBiscuit: `f`,
  echo: `Draw and tuck two {7}.`,
  dogma: [
    `Score a top card from your board without a bonus.`,
    `You may splay your red cards up.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .cards.tops(player)
        .filter(card => !card.checkHasBonus())
      game.actions.chooseAndScore(player, choices)
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['red'], 'up')
    }
  ],
  echoImpl: (game, player, { self }) => {
    game.actions.drawAndTuck(player, game.getEffectAge(self, 7))
    game.actions.drawAndTuck(player, game.getEffectAge(self, 7))
  },
}
