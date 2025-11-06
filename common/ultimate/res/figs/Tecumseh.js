module.exports = {
  id: `Tecumseh`,  // Card names are unique in Innovation
  name: `Tecumseh`,
  color: `red`,
  age: 6,
  expansion: `figs`,
  biscuits: `fh&f`,
  dogmaBiscuit: `f`,
  karma: [
    `If you would tuck a card with a {f}, first return a top card with a {f} from another player's board.`
  ],
  karmaImpl: [
    {
      trigger: 'tuck',
      kind: 'would-first',
      matches: (game, player, { card }) => card.checkHasBiscuit('f'),
      func: (game, player) => {
        const choices = game
          .players.all()
          .filter(other => other !== player)
          .flatMap(player => game.cards.tops(player))
          .filter(card => card.checkHasBiscuit('f'))
        game.actions.chooseAndReturn(player, choices)
      }
    }
  ]
}
