export default {
  id: `Rowland Hill`,  // Card names are unique in Innovation
  name: `Rowland Hill`,
  color: `yellow`,
  age: 7,
  expansion: `figs`,
  biscuits: `pchc`,
  dogmaBiscuit: `c`,
  karma: [
    `If you would claim an achievement, first return three cards from your hand. If you do, achieve all other cards in your hand, ignoring eligibility.`
  ],
  karmaImpl: [
    {
      trigger: 'achieve',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const cards = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'), { count: 3 })
        if (cards && cards.length === 3) {
          const remaining = game.cards.byPlayer(player, 'hand')
          for (const card of remaining) {
            game.actions.claimAchievement(player, { card })
          }
        }
      }
    }
  ]
}
