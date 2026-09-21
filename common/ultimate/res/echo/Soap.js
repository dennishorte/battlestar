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
      const colorOptions = game.util.colors().map(c =>
        game.actions.option({ id: c, title: c, kind: 'color' })
      )
      const colorPick = game.actions.choose(player, colorOptions)[0]
      const color = (colorPick && typeof colorPick === 'object') ? colorPick.id : colorPick
      const tucked = game.actions.chooseAndTuck(player, game.cards.byPlayer(player, 'hand'), {
        min: 0,
        max: 999,
        filter: card => card.color === color,
      })

      if (tucked.length > 0) {
        const topValue = game.cards.top(player, color).getAge()
        const opponentValues = game
          .players.opponents(player)
          .map(opp => game.cards.top(opp, color))
          .filter(card => card)
          .map(card => card.getAge())

        if (opponentValues.every(value => value < topValue)) {
          game.actions.chooseAndAchieve(player, game.cards.byPlayer(player, 'hand'), {
            min: 0,
            max: 1,
            filter: card => player.canClaimAchievement(card),
          })
        }
      }
    }
  ],
  echoImpl: [],
}
