module.exports = {
  id: `Galileo Galilei`,  // Card names are unique in Innovation
  name: `Galileo Galilei`,
  color: `green`,
  age: 4,
  expansion: `figs`,
  biscuits: `hcc&`,
  dogmaBiscuit: `c`,
  echo: `Draw and foreshadow a {5} or {6}.`,
  karma: [
    `If you would foreshadow a card of value not present in your forecast, first transfer all cards from your forecast into your hand.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    const age = game.actions.chooseAge(player, [
      game.getEffectAge(this, 5),
      game.getEffectAge(this, 6)
    ])
    game.actions.drawAndForeshadow(player, age)
  },
  karmaImpl: [
    {
      trigger: 'foreshadow',
      kind: 'would-first',
      matches: (game, player, { card }) => {
        const forecastCards = game.getCardsByZone(player, 'forecast')
        const matchedAge = forecastCards.find(c => c.getAge() === card.getAge())
        return matchedAge === undefined
      },
      func: (game, player) => {
        game.actions.transferMany(
          player,
          game.getCardsByZone(player, 'forecast'),
          game.getZoneByPlayer(player, 'hand')
        )
      }
    }
  ]
}
