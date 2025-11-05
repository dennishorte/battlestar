module.exports = {
  id: `Adam Smith`,  // Card names are unique in Innovation
  name: `Adam Smith`,
  color: `green`,
  age: 6,
  expansion: `figs`,
  biscuits: `*fcc`,
  dogmaBiscuit: `c`,
  echo: ``,
  karma: [
    `Each {c} on your board provides two additional {c}.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'calculate-biscuits',
      func(game, player, { biscuits }) {
        const extras = game.utilEmptyBiscuits()
        extras.c = biscuits.c * 2
        return extras
      }
    }
  ]
}
