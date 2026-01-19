export default {
  id: `Sergey Brin`,  // Card names are unique in Innovation
  name: `Sergey Brin`,
  color: `green`,
  age: 10,
  expansion: `figs`,
  biscuits: `hiip`,
  dogmaBiscuit: `i`,
  karma: [
    `Each top card on every player's board counts as a card you can activate with a Dogma action.`,
    `If you would dogma a card on another player's board, first splay its color up on your board.`
  ],
  karmaImpl: [
    {
      trigger: 'list-effects',
      func: (game) => {
        return game
          .players.all()
          .flatMap(p => game.getDogmaTargets(p))
      }
    },
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: (game, player, { card }) => card.owner.id !== player.id,
      func: (game, player, { card }) => {
        game.actions.splay(player, card.color, 'up')
      }
    }
  ]
}
