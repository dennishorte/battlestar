export default {
  id: `Margaret Thatcher`,  // Card names are unique in Innovation
  name: `Margaret Thatcher`,
  color: `red`,
  age: 10,
  expansion: `figs`,
  biscuits: `ffph`,
  dogmaBiscuit: `f`,
  karma: [
    `You may issue a War Decree with any two figures.`,
    `If you would take a Dogma action, first score any top card with a {c} or {f} from anywhere.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'War',
    },
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const choices = game
          .players.all()
          .flatMap(player => game.cards.tops(player))
          .filter(card => card.biscuits.includes('f') || card.biscuits.includes('c'))
        game.actions.chooseAndScore(player, choices)
      }
    }
  ]
}
