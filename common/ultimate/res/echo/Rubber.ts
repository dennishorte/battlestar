export default {
  name: `Rubber`,
  color: `red`,
  age: 7,
  expansion: `echo`,
  biscuits: `h&f7`,
  dogmaBiscuit: `f`,
  echo: `Draw and tuck two {8}.`,
  dogma: [
    `Score a top card from your board without a bonus.`,
    `You may splay your red cards up.`,
    `If Rubber was foreseen, foreshadow a top card on your board.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .cards
        .tops(player)
        .filter(card => !card.checkHasBonus())
      game.actions.chooseAndScore(player, choices)
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['red'], 'up')
    },

    (game, player, { foreseen, self }) => {
      game.log.addForeseen(foreseen, self)
      if (foreseen) {
        const choices = game.cards.tops(player)
        game.actions.chooseAndForeshadow(player, choices)
      }
    },
  ],
  echoImpl: (game, player, { self }) => {
    game.actions.drawAndTuck(player, game.getEffectAge(self, 8))
    game.actions.drawAndTuck(player, game.getEffectAge(self, 8))
  },
}
