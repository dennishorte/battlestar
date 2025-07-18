module.exports = {
  name: `Industrialization`,
  color: `red`,
  age: 6,
  expansion: `base`,
  biscuits: `cffh`,
  dogmaBiscuit: `f`,
  dogma: [
    `Draw and tuck three {6}. Then, if you are the single player with the most {i}, return your top red card.`,
    `You may splay your red or purple cards right.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      for (let i = 0; i < 3; i++) {
        game.aDrawAndTuck(player, game.getEffectAge(self, 6))
      }

      const playerWithMost = game.getUniquePlayerWithMostBiscuits('i')
      if (playerWithMost && playerWithMost.name === player.name) {
        const card = game.getTopCard(player, 'red')
        if (card) {
          game.aReturn(player, card)
        }
      }
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['red', 'purple'], 'right')
    },
  ],
}
