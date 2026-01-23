module.exports = {
  id: `Hammurabi`,  // Card names are unique in Innovation
  name: `Hammurabi`,
  color: `red`,
  age: 1,
  expansion: `figs`,
  biscuits: `sph2`,
  dogmaBiscuit: `s`,
  karma: [
    `If a player would execute a demand effect against you, first execute that demand effect yourself on that player.`,
  ],
  karmaImpl: [
    {
      trigger: 'demand-success',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { effectInfo, leader }) => {
        game.executeEffect(leader, effectInfo, {
          biscuits: game.getBiscuits(),
          leader: player,
          self: effectInfo.card,
        })
      }
    }
  ]
}
