module.exports = {
  id: `Margaret Thatcher`,  // Card names are unique in Innovation
  name: `Margaret Thatcher`,
  color: `red`,
  age: 10,
  expansion: `figs`,
  biscuits: `ff&h`,
  dogmaBiscuit: `f`,
  echo: `Score a top card with a {f} or {c}.`,
  karma: [
    `If you would take a Dogma action, first score any top card with a {c} or {f} from anywhere.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    const choices = game
      .getPlayerAll()
      .flatMap(player => game.getTopCards(player))
      .filter(card => card.biscuits.includes('f') || card.biscuits.includes('c'))
    game.aChooseAndScore(player, choices)
  },
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const choices = game
          .getPlayerAll()
          .flatMap(player => game.getTopCards(player))
          .filter(card => card.biscuits.includes('f') || card.biscuits.includes('c'))
        game.aChooseAndScore(player, choices)
      }
    }
  ]
}
