module.exports = {
  id: `Cristopher Columbus`,  // Card names are unique in Innovation
  name: `Cristopher Columbus`,
  color: `green`,
  age: 4,
  expansion: `figs`,
  biscuits: `4lh*`,
  dogmaBiscuit: `l`,
  echo: ``,
  karma: [
    `You may issue a Trade Decree with any two figures.`,
    `Each {f} on your board provides two additional {c}.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Trade',
    },
    {
      trigger: 'calculate-biscuits',
      func: (game, player, { biscuits }) => {
        const extra = game.utilEmptyBiscuits()
        extra.c = biscuits.f * 2
        return extra
      }
    }
  ]
}
