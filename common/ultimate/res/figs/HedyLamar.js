module.exports = {
  id: `Hedy Lamar`,  // Card names are unique in Innovation
  name: `Hedy Lamar`,
  color: `green`,
  age: 9,
  expansion: `figs`,
  biscuits: `i&ih`,
  dogmaBiscuit: `i`,
  karma: [
    `You may issue a Trade Decree with any two figures.`,
    `Each special achievement is claimed with one fewer or one lower of each requirement listed for you.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Trade',
    },
    {
      trigger: 'reduce-special-achievement-requirements',
    }
  ]
}
