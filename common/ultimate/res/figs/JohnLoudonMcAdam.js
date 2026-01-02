module.exports = {
  id: `John Loudon McAdam`,  // Card names are unique in Innovation
  name: `John Loudon McAdam`,
  color: `yellow`,
  age: 6,
  expansion: `figs`,
  biscuits: `hfpf`,
  dogmaBiscuit: `f`,
  karma: [
    `You may issue an Expansion Decree with any two figures.`,
    `Each top card with a {f} on your board counts as an available achievement for you.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Expansion',
    },
    {
      trigger: 'list-achievements',
      func: (game, player) => {
        return game
          .cards.tops(player)
          .filter(card => card.biscuits.includes('f'))
      }
    }
  ]
}
