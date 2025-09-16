module.exports = {
  id: `Takiyuddin`,  // Card names are unique in Innovation
  name: `Takiyuddin`,
  color: `blue`,
  age: 4,
  expansion: `figs`,
  biscuits: `*llh`,
  dogmaBiscuit: `l`,
  echo: ``,
  karma: [
    `You may issue an Advancement Decree with any two figures.`,
    `If you would take an Inspire action, first you may splay that color right.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement',
    },
    {
      trigger: 'inspire',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { color }) => {
        game.aChooseAndSplay(player, [color], 'right')
      }
    }
  ]
}
