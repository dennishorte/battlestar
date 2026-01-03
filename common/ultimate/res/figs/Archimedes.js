module.exports = {
  id: `Archimedes`,  // Card names are unique in Innovation
  name: `Archimedes`,
  color: `blue`,
  age: 2,
  expansion: `figs`,
  biscuits: `shps`,
  dogmaBiscuit: `s`,
  karma: [
    `You may issue an Advancement Decree with any two figures.`,
    `If you would execute an effect, first increase every age value in the effect by one for the duration of the effect.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement'
    },
    {
      trigger: 'dogma',
      karmaKind: 'would-first',
      matches: () => true,
      func(game) {
        game.state.dogmaInfo.globalAgeIncrease = 1
      }
    }
  ]
}
