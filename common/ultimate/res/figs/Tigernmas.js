module.exports = {
  id: `Tigernmas`,  // Card names are unique in Innovation
  name: `Tigernmas`,
  color: `red`,
  age: 1,
  expansion: `figs`,
  biscuits: `hl*l`,
  dogmaBiscuit: `l`,
  echo: ``,
  karma: [
    `You may issue a War Decree with any two figures.`,
    `Each card in your hand provides one additional point toward your score.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'War',
    },
    {
      trigger: 'calculate-score',
      func: (game, player) => {
        return game.cards.byPlayer(player, 'hand').length
      }
    }
  ]
}
