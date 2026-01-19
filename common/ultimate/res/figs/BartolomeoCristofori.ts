export default {
  id: `Bartolomeo Cristofori`,  // Card names are unique in Innovation
  name: `Bartolomeo Cristofori`,
  color: `purple`,
  age: 5,
  expansion: `figs`,
  biscuits: `lphl`,
  dogmaBiscuit: `l`,
  karma: [
    `If you would meld a fifth visible card of a color on your board, first claim an available standard achievement regardless of eligibility.`
  ],
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-first',
      matches(game, player, { card }) {
        const zone = game.zones.byPlayer(player, card.color)
        return zone.splay !== 'none' && zone.cardlist().length === 4
      },
      func(game, player) {
        const choices = game.getAvailableStandardAchievements(player)
        game.actions.chooseAndAchieve(player, choices)
      }
    }
  ]
}
