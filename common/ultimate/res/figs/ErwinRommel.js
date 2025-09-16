module.exports = {
  id: `Erwin Rommel`,  // Card names are unique in Innovation
  name: `Erwin Rommel`,
  color: `red`,
  age: 8,
  expansion: `figs`,
  biscuits: `fhf&`,
  dogmaBiscuit: `f`,
  echo: `Transfer a card from any score pile to yours.`,
  karma: [
    `You may issue a War Decree with any two figures.`,
    `If you would score a card, instead score the top card of its color from all boards.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    const choices = game
      .getPlayerAll()
      .filter(other => other !== player)
      .flatMap(player => game.getCardsByZone(player, 'score'))
    game.actions.chooseAndTransfer(player, choices, game.getZoneByPlayer(player, 'score'), { hidden: true })
  },
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'War',
    },
    {
      trigger: 'score',
      kind: 'would-instead',
      matches: () => true,
      func: (game, player, { card }) => {
        const cards = game
          .getPlayerAll()
          .flatMap(player => game.getTopCards(player))
          .filter(other => other.color === card.color)
        game.aScoreMany(player, cards)
      }
    }
  ]
}
