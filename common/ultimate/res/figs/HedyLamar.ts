export default {
  id: `Hedy Lamar`,  // Card names are unique in Innovation
  name: `Hedy Lamar`,
  color: `green`,
  age: 9,
  expansion: `figs`,
  biscuits: `ipih`,
  dogmaBiscuit: `i`,
  karma: [
    `Each special achievement is claimed with one fewer or one lower of each requirement listed for you.`,
    `If you would claim an achievement, first splay a color of your cards up.`
  ],
  karmaImpl: [
    {
      trigger: 'reduce-special-achievement-requirements',
    },
    {
      trigger: 'achieve',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        game.actions.chooseAndSplay(player, game.util.colors(), 'up')
      }
    }
  ]
}
