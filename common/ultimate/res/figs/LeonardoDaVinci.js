module.exports = {
  id: `Leonardo Da Vinci`,  // Card names are unique in Innovation
  name: `Leonardo Da Vinci`,
  color: `yellow`,
  age: 4,
  expansion: `figs`,
  biscuits: `&5hl`,
  dogmaBiscuit: `l`,
  echo: `Score a top figure with a bonus from anywhere.`,
  karma: [
    `If you would meld a yellow card, first meld every non-yellow, non-purple card in your hand.`,
    `If you would meld a purple card, first draw three {4}.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    const choices = game
      .players.all()
      .flatMap(player => game.cards.tops(player))
      .filter(card => card.checkIsFigure())
      .filter(card => card.checkHasBonus())
    game.actions.chooseAndScore(player, choices)
  },
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: (game, player, { card }) => card.color === 'yellow',
      func: (game, player) => {
        const toMeld = game
          .cards.byPlayer(player, 'hand')
          .filter(card => card.color !== 'yellow' && card.color !== 'purple')
        game.actions.meldMany(player, toMeld)
      }
    },
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: (game, player, { card }) => card.color === 'purple',
      func: (game, player) => {
        game.actions.draw(player, { age: game.getEffectAge(this, 4) })
        game.actions.draw(player, { age: game.getEffectAge(this, 4) })
        game.actions.draw(player, { age: game.getEffectAge(this, 4) })
      }
    },
  ]
}
