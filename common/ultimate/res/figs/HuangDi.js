module.exports = {
  id: `Huang Di`,  // Card names are unique in Innovation
  name: `Huang Di`,
  color: `blue`,
  age: 1,
  expansion: `figs`,
  biscuits: `ss&h`,
  dogmaBiscuit: `s`,
  echo: `Draw a {2}.`,
  karma: [
    `You may issue an advancement decree with any two figures.`,
    `Each {s} on your board provides one additional {l}.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    game.actions.draw(player, { age: game.getEffectAge(this, 2) })
  },
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement',
    },
    {
      trigger: 'calculate-biscuits',
      func: (game, player, { biscuits }) => {
        const output = game.utilEmptyBiscuits()
        output.l = biscuits.s
        return output
      }
    }
  ]
}
