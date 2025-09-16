module.exports = {
  id: `George Stephenson`,  // Card names are unique in Innovation
  name: `George Stephenson`,
  color: `green`,
  age: 7,
  expansion: `figs`,
  biscuits: `7&fh`,
  dogmaBiscuit: `f`,
  echo: `You may splay up a color you have splayed right.`,
  karma: [
    `If you would claim an achievement, first transfer the bottom card from each non-empty age below 10 to the available achievements.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    const rightColors = game
      .utilColors()
      .filter(color => game.getZoneByPlayer(player, color).splay === 'right')
    game.aChooseAndSplay(player, rightColors, 'up')
  },
  karmaImpl: [
    {
      trigger: 'achieve',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        for (let i = 1; i < 10; i++) {
          const deck = game.getZoneByDeck('base', i)
          const cards = deck.cards()
          if (cards.length > 0) {
            const card = cards[cards.length - 1]
            game.mTransfer(player, card, game.getZoneById('achievements'))
          }
        }
      }
    }
  ]
}
