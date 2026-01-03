module.exports = {
  id: `Fu Xi`,  // Card names are unique in Innovation
  name: `Fu Xi`,
  color: `green`,
  age: 1,
  expansion: `figs`,
  biscuits: `pchc`,
  dogmaBiscuit: `c`,
  karma: [
    `You may issue a Trade Decree with any two figures.`,
    `If you would draw a card during your first action, first draw and score a {2}.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Trade',
    },
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: (game) => {
        return game.state.actionNumber === 1
      },
      func(game, player, { self }) {
        game.actions.drawAndScore(player, game.getEffectAge(self, 2))
      },
    },
  ]
}
