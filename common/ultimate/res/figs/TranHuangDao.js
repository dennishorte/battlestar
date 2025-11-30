module.exports = {
  id: `Tran Huang Dao`,  // Card names are unique in Innovation
  name: `Tran Huang Dao`,
  color: `red`,
  age: 3,
  expansion: `figs`,
  biscuits: `hpkk`,
  dogmaBiscuit: `k`,
  karma: [
    `If you would draw a {3}, first score a top red card of value less than 4 from anywhere.`,
    `Each two {k} on your board provides one additional icon of every other standard icon on your board.`
  ],
  karmaImpl: [
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: (game, player, { age, self }) => age === game.getEffectAge(self, 3),
      func: (game, player) => {
        const options = game
          .players
          .all()
          .map(p => game.cards.top(p, 'red'))
          .filter(x => Boolean(x))
          .filter(x => x.getAge() < 4)
        game.actions.chooseAndScore(player, options)
      }
    },
    {
      trigger: 'calculate-biscuits',
      func: (game, player, { biscuits }) => {
        const bonus = Math.floor(biscuits.k / 2)
        const output = game.util.emptyBiscuits()
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
