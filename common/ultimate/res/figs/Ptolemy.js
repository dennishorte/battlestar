module.exports = {
  id: `Ptolemy`,  // Card names are unique in Innovation
  name: `Ptolemy`,
  color: `green`,
  age: 2,
  expansion: `figs`,
  biscuits: `hc*c`,
  dogmaBiscuit: `c`,
  echo: ``,
  karma: [
    `You may issue a Trade Decree with any two figures.`,
    `Each top blue card on every player's board counts as a card you can activate with a Dogma action.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Trade',
    },
    {
      trigger: 'list-effects',
      func(game, player) {
        return game
          .players.all()
          .map(player => game.getTopCard(player, 'blue'))
          .filter(card => card !== undefined)
      }
    }
  ]
}
