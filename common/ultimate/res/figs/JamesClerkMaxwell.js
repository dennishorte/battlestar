module.exports = {
  id: `James Clerk Maxwell`,  // Card names are unique in Innovation
  name: `James Clerk Maxwell`,
  color: `blue`,
  age: 7,
  expansion: `figs`,
  biscuits: `h*7i`,
  dogmaBiscuit: `i`,
  karma: [
    `Each card in hand provides one additional icon of every type on your board.`
  ],
  karmaImpl: [
    {
      trigger: 'calculate-biscuits',
      func: (game, player, { biscuits }) => {
        const bonus = game.cards.byPlayer(player, 'hand').length
        const output = game.utilEmptyBiscuits()
        for (const biscuit of Object.keys(biscuits)) {
          if (biscuits[biscuit] > 0) {
            output[biscuit] = bonus
          }
        }
        return output
      }
    }
  ]
}
