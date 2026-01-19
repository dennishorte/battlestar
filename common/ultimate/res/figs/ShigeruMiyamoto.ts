export default {
  id: `Shigeru Miyamoto`,  // Card names are unique in Innovation
  name: `Shigeru Miyamoto`,
  color: `yellow`,
  age: 10,
  expansion: `figs`,
  biscuits: `haip`,
  dogmaBiscuit: `i`,
  karma: [
    `If you would dogma a card using {i} as the featured biscuit, first if you have exactly one, three, or six {i} on your board, you win.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: (game, player, { card }) => card.checkHasBiscuit('i'),
      func: (game, player, { self }) => {
        const clocks = player.biscuits().i
        if (clocks === 1 || clocks === 3 || clocks === 6) {
          game.youWin(player, self.name)
        }
        else {
          game.log.addNoEffect()
        }
      }
    }
  ]
}
