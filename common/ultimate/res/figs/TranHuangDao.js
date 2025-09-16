module.exports = {
  id: `Tran Huang Dao`,  // Card names are unique in Innovation
  name: `Tran Huang Dao`,
  color: `red`,
  age: 3,
  expansion: `figs`,
  biscuits: `h&kk`,
  dogmaBiscuit: `k`,
  echo: `Score a top red card of value less than 4 from anywhere.`,
  karma: [
    `Each two {k} on your board provides one additional icon of every other type on your board.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    const choices = game
      .getTopCardsAll()
      .filter(card => card.getAge() < 4)
      .filter(card => card.color === 'red')
    game.aChooseAndScore(player, choices)
  },
  karmaImpl: [
    {
      trigger: 'calculate-biscuits',
      func: (game, player, { biscuits }) => {
        const bonus = Math.floor(biscuits.k / 2)
        const output = game.utilEmptyBiscuits()
        for (const b of Object.keys(biscuits)) {
          if (b !== 'k' && biscuits[b] > 0) {
            output[b] = bonus
          }
        }
        return output
      }
    }
  ]
}
