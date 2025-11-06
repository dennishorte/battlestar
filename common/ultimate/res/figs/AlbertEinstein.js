module.exports = {
  id: `Albert Einstein`,  // Card names are unique in Innovation
  name: `Albert Einstein`,
  color: `blue`,
  age: 8,
  expansion: `figs`,
  biscuits: `hs&8`,
  dogmaBiscuit: `s`,
  karma: [
    `You may issue an Advancement Decree with any two figures.`,
    `Each {} value in any of your effects counts as a {0}.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement'
    },
    {
      trigger: 'effect-age',
      func(game, player, card, age) {
        return 10
      }
    }
  ]
}
