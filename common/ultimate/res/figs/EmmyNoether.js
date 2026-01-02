module.exports = {
  id: `Emmy Noether`,  // Card names are unique in Innovation
  name: `Emmy Noether`,
  color: `green`,
  age: 8,
  expansion: `figs`,
  biscuits: `piih`,
  dogmaBiscuit: `i`,
  karma: [
    `Each {i} on your board provides an additional number of points equal to the number of {i} on your board.`,
    `If a player would score a card, first junk a card from that player's score pile.`
  ],
  karmaImpl: [
    {
      trigger: 'calculate-score',
      func: (game, player) => {
        const biscuits = player.biscuits()
        return biscuits.i * biscuits.i
      }
    },
    {
      trigger: 'score',
      triggerAll: true,
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { owner }) => {
        game.actions.chooseAndJunk(owner, game.cards.byPlayer(player, 'score'))
      }
    },
  ]
}
