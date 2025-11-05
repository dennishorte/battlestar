module.exports = {
  id: `Shennong`,  // Card names are unique in Innovation
  name: `Shennong`,
  color: `yellow`,
  age: 1,
  expansion: `figs`,
  biscuits: `llh*`,
  dogmaBiscuit: `l`,
  echo: ``,
  karma: [
    `If you would foreshadow a card of the same value as a card in your forecast, first score each card of that value in your forecast.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'foreshadow',
      kind: 'would-first',
      matches: (game, player, { card }) => {
        const forecast = game.cards.byPlayer(player, 'forecast')
        return forecast.find(other => other.getAge() === card.getAge())
      },
      func(game, player, { card }) {
        const toScore = game
          .cards.byPlayer(player, 'forecast')
          .filter(other => other.getAge() === card.getAge())
        game.actions.scoreMany(player, toScore)
      },
    }
  ]
}
