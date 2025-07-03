module.exports = {
  name: `Printing Press`,
  color: `blue`,
  age: 4,
  expansion: `base`,
  biscuits: `hssc`,
  dogmaBiscuit: `s`,
  dogma: [
    `You may return a card from your score pile. If you do, draw a card of value two higher than the top purple card on your board.`,
    `You may splay your blue cards right.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .getZoneByPlayer(player, 'score')
        .cards()
        .map(c => c.id)
      const card = game.actions.chooseCard(player, choices, { min: 0, max: 1 })

      if (card) {
        game.aReturn(player, card)

        const topPurple = game
          .getZoneByPlayer(player, 'purple')
          .cards()[0]
        const drawAge = topPurple ? topPurple.getAge() + 2 : 2
        game.aDraw(player, { age: drawAge })
      }
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['blue'], 'right')
    }
  ],
}
