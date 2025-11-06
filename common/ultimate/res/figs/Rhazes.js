module.exports = {
  id: `Rhazes`,  // Card names are unique in Innovation
  name: `Rhazes`,
  color: `yellow`,
  age: 3,
  expansion: `figs`,
  biscuits: `hll&`,
  dogmaBiscuit: `l`,
  karma: [
    `If you would draw a card, first tuck a card of the same value from your hand.`
  ],
  karmaImpl: [
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { age }) => {
        const choices = game
          .cards.byPlayer(player, 'hand')
          .filter(other => other.getAge() === age)
        game.actions.chooseAndTuck(player, choices)
      }
    }
  ]
}
