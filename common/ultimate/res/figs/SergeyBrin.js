module.exports = {
  id: `Sergey Brin`,  // Card names are unique in Innovation
  name: `Sergey Brin`,
  color: `green`,
  age: 10,
  expansion: `figs`,
  biscuits: `hii*`,
  dogmaBiscuit: `i`,
  karma: [
    `Each top card on every player's board counts as a card you can activate with a Dogma action.`
  ],
  karmaImpl: [
    {
      trigger: 'list-effects',
      func: (game, player) => {
        return game
          .players.all()
          .flatMap(player => game.getDogmaTargets(player))
      }
    }
  ]
}
