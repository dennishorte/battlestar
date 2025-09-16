module.exports = {
  id: `Rowland Hill`,  // Card names are unique in Innovation
  name: `Rowland Hill`,
  color: `yellow`,
  age: 7,
  expansion: `figs`,
  biscuits: `*chc`,
  dogmaBiscuit: `c`,
  echo: ``,
  karma: [
    `If you would claim an achievement, first return three cards from your hand. If you do, claim all other cards in your hand as achievements, ignoring eligibility.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'achieve',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const cards = game.actions.chooseAndReturn(player, game.getCardsByZone(player, 'hand'), { count: 3})
        if (cards && cards.length === 3) {
          const remaining = game.getCardsByZone(player, 'hand')
          for (const card of remaining) {
            game.aClaimAchievement(player, { card })
          }
        }
      }
    }
  ]
}
