export default {
  id: `Giuseppe Scionti`,  // Card names are unique in Innovation
  name: `Giuseppe Scionti`,
  color: `blue`,
  age: 11,
  expansion: `figs`,
  biscuits: `ffph`,
  dogmaBiscuit: `f`,
  karma: [
    `If you would execute a dogma effect, first draw and score a {9}.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma-effect',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { self }) => {
        game.actions.drawAndScore(player, game.getEffectAge(self, 9))
      }
    }
  ]
}
