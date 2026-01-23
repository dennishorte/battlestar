module.exports = {
  name: `Soap`,
  color: `yellow`,
  age: 1,
  expansion: `echo`,
  biscuits: `l2hl`,
  dogmaBiscuit: `l`,
  echo: [],
  dogma: [
    `Choose a color. You may tuck any number of cards of that color from your hand. If you do, and your top card of that color is higher than each opponent's, you may achieve (if eligible) a card from your hand.`
  ],
  dogmaImpl: [
    (game, player) => {
      const color = game.actions.choose(player, game.util.colors())[0]
      const choices = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.color === color)

      const tucked = game.actions.chooseAndTuck(player, choices, { min: 0, max: 999 })

      if (tucked.length > 0) {
        const topValue = game.cards.top(player, color).getAge()
        const opponentValues = game
          .players.opponents(player)
          .map(opp => game.cards.top(opp, color))
          .filter(card => card)
          .map(card => card.getAge())

        if (opponentValues.every(value => value < topValue)) {
          const eligible = game
            .cards.byPlayer(player, 'hand')
            .filter(card => player.canClaimAchievement(card))
          game.actions.chooseAndAchieve(player, eligible, { min: 0, max: 1 })
        }
      }
    }
  ],
  echoImpl: [],
}
