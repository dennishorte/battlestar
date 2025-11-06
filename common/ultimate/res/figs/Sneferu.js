module.exports = {
  id: `Sneferu`,  // Card names are unique in Innovation
  name: `Sneferu`,
  color: `yellow`,
  age: 1,
  expansion: `figs`,
  biscuits: `hkk*`,
  dogmaBiscuit: `k`,
  karma: [
    `You may issue an Expansion decree with any two figures.`,
    `Each {k} on your board provides one additional {c}.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Expansion'
    },
    {
      trigger: 'calculate-biscuits',
      func(game, player, { biscuits }) {
        const output = game.utilEmptyBiscuits()
        output.c = biscuits.k
        return output
      }
    }
  ]
}
