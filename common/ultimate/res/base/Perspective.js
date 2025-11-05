module.exports = {
  name: `Perspective`,
  color: `yellow`,
  age: 4,
  expansion: `base`,
  biscuits: `hssl`,
  dogmaBiscuit: `s`,
  dogma: [
    `You may return a card from your hand. If you do, score a card from your hand for every two {s} on your board.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.actions.chooseAndReturn(
        player,
        game.cards.byPlayer(player, 'hand'),
        { min: 0, max: 1 }
      )

      if (cards && cards.length > 0) {
        const count = Math.floor(player.biscuits().s / 2)
        game.actions.chooseAndScore(player, game.cards.byPlayer(player, 'hand'), { count })
      }
    }
  ],
}
