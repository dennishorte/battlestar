module.exports = {
  name: `Stove`,
  color: `yellow`,
  age: 5,
  expansion: `echo`,
  biscuits: `h6f&`,
  dogmaBiscuit: `f`,
  echo: `Score a top card from your board without a {f}.`,
  dogma: [
    `Draw and tuck a {4}. If your top card of the tucked card's color has value less than {4}, draw and score a {4}.`,
    `You may splay your green cards right.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const tucked = game.actions.drawAndTuck(player, game.getEffectAge(self, 4))
      if (tucked) {
        const top = game.getTopCard(player, tucked.color)
        if (top.getAge() < game.getEffectAge(self, 4)) {
          game.actions.drawAndScore(player, game.getEffectAge(self, 4))
        }
      }
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['green'], 'right')
    }
  ],
  echoImpl: (game, player) => {
    const choices = game
      .cards.tops(player)
      .filter(card => !card.checkHasBiscuit('f'))
    game.actions.chooseAndScore(player, choices)
  },
}
