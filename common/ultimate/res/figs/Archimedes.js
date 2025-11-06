module.exports = {
  id: `Archimedes`,  // Card names are unique in Innovation
  name: `Archimedes`,
  color: `blue`,
  age: 2,
  expansion: `figs`,
  biscuits: `sh&s`,
  dogmaBiscuit: `s`,
  karma: [
    `You may issue an Advancement Decree with any two figures.`,
    `If you would take a Dogma action, first increase every {} value in each echo and dogma effect by one.`
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
      func(game, player, card, age) {
        game.state.dogmaInfo.globalAgeIncrease = 1
      }
    }
  ]
}
