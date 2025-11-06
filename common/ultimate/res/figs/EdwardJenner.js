module.exports = {
  id: `Edward Jenner`,  // Card names are unique in Innovation
  name: `Edward Jenner`,
  color: `yellow`,
  age: 6,
  expansion: `figs`,
  biscuits: `*llh`,
  dogmaBiscuit: `l`,
  karma: [
    `If a player would successfully demand something of you, instead return a card from your hand.`
  ],
  karmaImpl: [
    {
      trigger: 'demand-success',
      triggerAll: true,
      kind: 'would-instead',
      matches: (game, player) => {
        return player === game.getPlayerByCard(this)
      },
      func: (game, player) => {
        game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'))
      }
    }
  ]
}
