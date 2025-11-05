module.exports = {
  id: `Hammurabi`,  // Card names are unique in Innovation
  name: `Hammurabi`,
  color: `red`,
  age: 1,
  expansion: `figs`,
  biscuits: `s*h2`,
  dogmaBiscuit: `s`,
  echo: ``,
  karma: [
    `If a player would successfully demand something of you, first successfully demand that same thing of that player.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'demand-success',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { effectInfo, leader }) => {
        game.aCardEffect(leader, effectInfo, {
          biscuits: game.getBiscuits(),
          leader: player
        })
      }
    }
  ]
}
