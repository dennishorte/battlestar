module.exports = {
  id: `Bartolomeo Cristofori`,  // Card names are unique in Innovation
  name: `Bartolomeo Cristofori`,
  color: `purple`,
  age: 5,
  expansion: `figs`,
  biscuits: `l*hl`,
  dogmaBiscuit: `l`,
  karma: [
    `If you would meld the fifth visible card of a color on your board, first claim an achievement ignoring the scoring restriction.`
  ],
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-first',
      matches(game, player, { card }) {
        const zone = game.zones.byPlayer(player, card.color)
        return zone.splay !== 'none' && zone.cards().length === 4
      },
      func(game, player) {
        const choices = game.getEligibleAchievements(player, { ignoreScore: true })
        game.actions.chooseAndAchieve(player, choices)
      }
    }
  ]
}
