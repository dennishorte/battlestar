
module.exports = {
  id: `Shigeru Miyamoto`,  // Card names are unique in Innovation
  name: `Shigeru Miyamoto`,
  color: `yellow`,
  age: 10,
  expansion: `figs`,
  biscuits: `hai&`,
  dogmaBiscuit: `i`,
  karma: [
    `If you would take a Dogma action and activate a card whose featured biscuit is {i}, first if you have exactly one, three, or six {i} on your board, you win.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: (game, player, { card }) => card.checkHasBiscuit('i'),
      func: (game, player) => {
        const clocks = player.biscuits().i
        if (clocks === 1 || clocks === 3 || clocks === 6) {
          game.youWin(player, this.name)
        }
        else {
          game.log.addNoEffect()
        }
      }
    }
  ]
}
