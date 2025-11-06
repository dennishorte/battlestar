module.exports = {
  id: `Avicenna`,  // Card names are unique in Innovation
  name: `Avicenna`,
  color: `yellow`,
  age: 3,
  expansion: `figs`,
  biscuits: `*lhl`,
  dogmaBiscuit: `l`,
  karma: [
    `You may issue an Expansion Decree with any two figures.`,
    `If you are required to fade a figure, instead do nothing.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Expansion',
    },
    {
      trigger: 'no-fade'
    }
  ]
}
