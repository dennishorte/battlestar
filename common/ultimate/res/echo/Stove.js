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
    (game, player) => {
      const tucked = game.aDrawAndTuck(player, game.getEffectAge(this, 4))
      if (tucked) {
        const top = game.getTopCard(player, tucked.color)
        if (top.getAge() < game.getEffectAge(this, 4)) {
          game.aDrawAndScore(player, game.getEffectAge(this, 4))
        }
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['green'], 'right')
    }
  ],
  echoImpl: (game, player) => {
    const choices = game
      .getTopCards(player)
      .filter(card => !card.checkHasBiscuit('f'))
    game.aChooseAndScore(player, choices)
  },
}
