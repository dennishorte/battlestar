module.exports = {
  name: `Fire`,
  color: `red`,
  age: 0,
  expansion: `base`,
  biscuits: `rsrh`,
  dogmaBiscuit: `r`,
  dogma: [
    `I demand you reveal a card in your hand of color not on my board or of value greater than 0! If you don't, you lose!`,
    `Meld a card from your hand of color on your board. If you don't, you lose.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const revealed = game.actions.chooseAndReveal(
        player,
        game.cards.byPlayer(player, 'hand'),
        {
          filter: card => {
            const notOnBoardCondition = !game.cards.top(leader, card.color)
            const greaterThanZeroCondition = card.getAge() > 0
            return notOnBoardCondition || greaterThanZeroCondition
          },
        },
      )[0]

      if (!revealed) {
        game.youLose(player, self.name)
      }
    },
    (game, player, { self }) => {
      const validColors = game.cards.tops(player).map(card => card.color)
      const melded = game.actions.chooseAndMeld(
        player,
        game.cards.byPlayer(player, 'hand'),
        { filter: card => validColors.includes(card.color) },
      )

      if (!melded || (Array.isArray(melded) && melded.length === 0)) {
        game.youLose(player, self.name)
        return
      }
    },
  ],
}
