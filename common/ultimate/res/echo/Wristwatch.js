module.exports = {
  name: `Wristwatch`,
  color: `yellow`,
  age: 9,
  expansion: `echo`,
  biscuits: `hfa&`,
  dogmaBiscuit: `f`,
  echo: `Take a non-yellow top card from your board and tuck it.`,
  dogma: [
    `For each visible bonus on your board, draw and tuck a card of that value, in ascending order.`
  ],
  dogmaImpl: [
    (game, player) => {
      const bonuses = game.getBonuses(player).sort((l, r) => l - r)
      for (const bonus of bonuses) {
        game.aDrawAndTuck(player, bonus)
      }
    }
  ],
  echoImpl: (game, player) => {
    const choices = game
      .getTopCards(player)
      .filter(card => card.color !== 'yellow')
    game.aChooseAndTuck(player, choices)
  },
}
