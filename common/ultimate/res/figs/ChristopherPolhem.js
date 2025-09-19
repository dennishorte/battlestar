module.exports = {
  id: `Christopher Polhem`,  // Card names are unique in Innovation
  name: `Christopher Polhem`,
  color: `yellow`,
  age: 5,
  expansion: `figs`,
  biscuits: `hff*`,
  dogmaBiscuit: `f`,
  echo: ``,
  karma: [
    `You may issue an Expansion Decree with any two figures.`,
    `Each {f} on your board provides two additional points towards your score.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Expansion',
    },
    {
      trigger: 'calculate-score',
      func: (game, player) => {
        return player.biscuits().f * 2
      }
    },
  ]
}
