module.exports = {
  id: `John Loudon McAdam`,  // Card names are unique in Innovation
  name: `John Loudon McAdam`,
  color: `yellow`,
  age: 6,
  expansion: `figs`,
  biscuits: `hf*f`,
  dogmaBiscuit: `f`,
  echo: ``,
  karma: [
    `You may issue an Expansion Decree with any two figures.`,
    `Each top card with a {f} on your board counts as an available achievement for you.`
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
      trigger: 'list-achievements',
      func: (game, player) => {
        return game
          .getTopCards(player)
          .filter(card => card.biscuits.includes('f'))
      }
    }
  ]
}
