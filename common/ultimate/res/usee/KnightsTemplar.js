module.exports = {
  name: `Knights Templar`,
  color: `red`,
  age: 3,
  expansion: `usee`,
  biscuits: `hlkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I demand you unsplay a splayed color on your board! If you do, transfer the top card on your board of that color to my score pile!`,
    `You may splay your red or green cards left.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const splayedColors = game
        .utilColors()
        .filter(color => game.zones.byPlayer(player, color).splay !== 'none')

      const color = game.actions.choose(player, splayedColors)[0]
      if (color) {
        const unsplayed = game.aUnsplay(player, color)
        if (unsplayed) {
          const topCard = game.getTopCard(player, color)
          if (topCard) {
            game.actions.transfer(player, topCard, game.zones.byPlayer(leader, 'score'))
          }
        }
      }
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['red', 'green'], 'left')
    },
  ],
}
