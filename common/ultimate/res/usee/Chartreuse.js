module.exports = {
  name: `Chartreuse`,
  color: `yellow`,
  age: 5,
  expansion: `usee`,
  biscuits: `lfhl`,
  dogmaBiscuit: `l`,
  dogma: [
    `Draw and reveal a {3}, a {4}, a {5}, and a {6}. Meld each drawn green card and each drawn yellow card, in any order. Return the other drawn cards.`,
    `You may splay your green or yellow cards right.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const cards = [
        game.actions.drawAndReveal(player, game.getEffectAge(self, 3)),
        game.actions.drawAndReveal(player, game.getEffectAge(self, 4)),
        game.actions.drawAndReveal(player, game.getEffectAge(self, 5)),
        game.actions.drawAndReveal(player, game.getEffectAge(self, 6)),
      ]

      const greenAndYellow = cards.filter(card => card.color === 'green' || card.color === 'yellow')
      const others = cards.filter(card => card.color !== 'green' && card.color !== 'yellow')

      game.actions.meldMany(player, greenAndYellow)
      game.actions.returnMany(player, others)
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['green', 'yellow'], 'right')
    }
  ],
}
