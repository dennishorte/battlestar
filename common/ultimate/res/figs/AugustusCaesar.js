module.exports = {
  id: `Augustus Caesar`,  // Card names are unique in Innovation
  name: `Augustus Caesar`,
  color: `green`,
  age: 2,
  expansion: `figs`,
  biscuits: `khkp`,
  dogmaBiscuit: `k`,
  karma: [
    `If any player would dogma a card with {k}, instead draw and reveal a card of the same value. If it has {k} or {s}, meld it. Otherwise, the player super-executes the original card.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      triggerAll: true,
      kind: 'would-instead',
      matches: (game, player, { card }) => card.checkHasBiscuit('k'),
      func(game, player, { card, owner, self }) {
        const drawn = game.actions.drawAndReveal(owner, card.getAge())
        if (drawn.checkHasBiscuit('k') || drawn.checkHasBiscuit('s')) {
          game.actions.meld(owner, drawn)
        }
        else {
          game.aSuperExecute(self, player, card)
        }
      },
    }
  ]
}
