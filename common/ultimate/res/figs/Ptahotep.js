module.exports = {
  id: `Ptahotep`,  // Card names are unique in Innovation
  name: `Ptahotep`,
  color: `purple`,
  age: 1,
  expansion: `figs`,
  biscuits: `h*kk`,
  dogmaBiscuit: `k`,
  echo: ``,
  karma: [
    `If a player would successfully demand something of you, first transfer the highest card from that player's score pile to your score pile.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'demand-success',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { leader }) => {
        const highest = game.utilHighestCards(game.getCardsByZone(leader, 'score')).slice(0, 1)
        game.aChooseAndTransfer(player, highest, game.getZoneByPlayer(player, 'score'))
      }
    }
  ]
}
