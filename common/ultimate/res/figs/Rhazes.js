module.exports = {
  id: `Rhazes`,  // Card names are unique in Innovation
  name: `Rhazes`,
  color: `yellow`,
  age: 3,
  expansion: `figs`,
  biscuits: `hll&`,
  dogmaBiscuit: `l`,
  echo: `Draw and foreshadow a {3}, {4}, or {5}.`,
  karma: [
    `If you would draw a card, first tuck a card of the same value from your hand.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    const age = game.actions.chooseAge(player, [
      game.getEffectAge(this, 3),
      game.getEffectAge(this, 4),
      game.getEffectAge(this, 5),
    ])
    game.actions.drawAndForeshadow(player, age)
  },
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
