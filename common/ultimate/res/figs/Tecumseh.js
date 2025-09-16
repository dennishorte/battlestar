module.exports = {
  id: `Tecumseh`,  // Card names are unique in Innovation
  name: `Tecumseh`,
  color: `red`,
  age: 6,
  expansion: `figs`,
  biscuits: `fh&f`,
  dogmaBiscuit: `f`,
  echo: `Draw and tuck a {6}.`,
  karma: [
    `If you would tuck a card with a {f}, first return a top card with a {f} from another player's board.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    game.aDrawAndTuck(player, game.getEffectAge(this, 6))
  },
  karmaImpl: [
    {
      trigger: 'tuck',
      kind: 'would-first',
      matches: (game, player, { card }) => card.checkHasBiscuit('f'),
      func: (game, player) => {
        const choices = game
          .getPlayerAll()
          .filter(other => other !== player)
          .flatMap(player => game.getTopCards(player))
          .filter(card => card.checkHasBiscuit('f'))
        game.aChooseAndReturn(player, choices)
      }
    }
  ]
}
