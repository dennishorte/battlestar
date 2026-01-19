export default {
  id: `Tigernmas`,  // Card names are unique in Innovation
  name: `Tigernmas`,
  color: `red`,
  age: 1,
  expansion: `figs`,
  biscuits: `hlpl`,
  dogmaBiscuit: `l`,
  karma: [
    `You may issue a War Decree with any two figures.`,
    `Each card in your hand provides one additional point toward your score.`
  ],
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
