module.exports = {
  id: `Fu Xi`,  // Card names are unique in Innovation
  name: `Fu Xi`,
  color: `green`,
  age: 1,
  expansion: `figs`,
  biscuits: `&chc`,
  dogmaBiscuit: `c`,
  karma: [
    `You may issue a Trade Decree with any two figures.`,
    `Each card in your score pile and forecast provides one additional {s}.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Trade',
    },
    {
      trigger: 'calculate-biscuits',
      func(game, player) {
        const scoreCount = game.cards.byPlayer(player, 'score').length
        const forecaseCount = game.cards.byPlayer(player, 'forecast').length
        const biscuits = game.utilEmptyBiscuits()
        biscuits.s = scoreCount + forecaseCount
        return biscuits
      }
    }
  ]
}
