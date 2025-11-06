module.exports = {
  id: `Ptahotep`,  // Card names are unique in Innovation
  name: `Ptahotep`,
  color: `purple`,
  age: 1,
  expansion: `figs`,
  biscuits: `h*kk`,
  dogmaBiscuit: `k`,
  karma: [
    `If a player would successfully demand something of you, first transfer the highest card from that player's score pile to your score pile.`
  ],
  karmaImpl: [
    {
      trigger: 'demand-success',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { leader }) => {
        const highest = game.util.highestCards(game.cards.byPlayer(leader, 'score')).slice(0, 1)
        game.actions.chooseAndTransfer(player, highest, game.zones.byPlayer(player, 'score'))
      }
    }
  ]
}
