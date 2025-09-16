module.exports = {
  id: `Su Song`,  // Card names are unique in Innovation
  name: `Su Song`,
  color: `green`,
  age: 3,
  expansion: `figs`,
  biscuits: `c*h3`,
  dogmaBiscuit: `c`,
  echo: ``,
  karma: [
    `You may issue a Trade Decree with any two figures.`,
    `If you would draw a {3}, first transfer a card from your score pile to your forecast.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Trade',
    },
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: (game, player, { age }) => age === 3,
      func: (game, player) => {
        game.aChooseAndTransfer(
          player,
          game.getCardsByZone(player, 'score'),
          game.getZoneByPlayer(player, 'forecast')
        )
      }
    }
  ]
}
