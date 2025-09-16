module.exports = {
  id: `Nikola Tesla`,  // Card names are unique in Innovation
  name: `Nikola Tesla`,
  color: `yellow`,
  age: 8,
  expansion: `figs`,
  biscuits: `8*sh`,
  dogmaBiscuit: `s`,
  echo: ``,
  karma: [
    `You may issue an Expansion Decree with any two figures.`,
    `If you would meld a card with a {s} or {i}, first score an opponent's top card with neither {s} nor {i}.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Expansion',
    },
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: (game, player, { card }) => card.checkHasBiscuit('s') || card.checkHasBiscuit('i'),
      func: (game, player) => {
        const choices = game
          .getPlayerOpponents(player)
          .flatMap(opp => game.getTopCards(opp))
          .filter(card => !card.checkHasBiscuit('s') && !card.checkHasBiscuit('i'))
        game.aChooseAndScore(player, choices)
      }
    }
  ]
}
