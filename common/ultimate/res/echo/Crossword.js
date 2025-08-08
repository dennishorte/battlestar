module.exports = {
  name: `Crossword`,
  color: `purple`,
  age: 8,
  expansion: `echo`,
  biscuits: `c8hc`,
  dogmaBiscuit: `c`,
  echo: ``,
  dogma: [
    `For each visible bonus on your board, draw a card of that value.`
  ],
  dogmaImpl: [
    (game, player) => {
      const remaining = game.getBonuses(player)

      while (remaining.length > 0) {
        const next = game.aChoose(player, remaining, { title: 'Draw next...' })[0]
        const index = remaining.indexOf(next)
        remaining.splice(index, 1)

        game.aDraw(player, { age: next })
      }
    }
  ],
  echoImpl: [],
}
