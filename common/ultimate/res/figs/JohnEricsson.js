module.exports = {
  id: `John Ericsson`,  // Card names are unique in Innovation
  name: `John Ericsson`,
  color: `red`,
  age: 7,
  expansion: `figs`,
  biscuits: `hff*`,
  dogmaBiscuit: `f`,
  echo: ``,
  karma: [
    `When you meld this card, score all opponents' top figures of value less than 7.`,
    `Each {f} on your board provides two additional {i}.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'when-meld',
      func: (game, player) => {
        const figs = game
          .getPlayerOpponents(player)
          .flatMap(opp => game.getTopCards(opp))
          .filter(card => card.checkIsFigure())
          .filter(card => card.getAge() < 7)
        game.actions.scoreMany(player, figs)
      }
    },
    {
      trigger: 'calculate-biscuits',
      func: (game, player, { biscuits }) => {
        const output = game.utilEmptyBiscuits()
        output.i = biscuits.f * 2
        return output
      }
    }
  ]
}
