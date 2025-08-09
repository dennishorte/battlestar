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
      game.aChooseAndScore(player, choices)
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['red'], 'up')
    }
  ],
  echoImpl: (game, player) => {
    game.actions.drawAndTuck(player, game.getEffectAge(this, 7))
    game.actions.drawAndTuck(player, game.getEffectAge(this, 7))
  },
}
