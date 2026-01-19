export default {
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
      const revealChoices = game
        .cards
        .byPlayer(player, 'hand')
        .filter(card => {
          const notOnBoardCondition = !game.cards.top(leader, card.color)
          const greaterThanZeroCondition = card.getAge() > 0
          return notOnBoardCondition || greaterThanZeroCondition
        })


      const revealed = game.actions.chooseAndReveal(player, revealChoices)[0]

      if (!revealed) {
        game.aYouLose(player, self)
      }
    },
    (game, player, { self }) => {
      const validColors = game.cards.tops(player).map(card => card.color)
      const meldChoices = game
        .cards
        .byPlayer(player, 'hand')
        .filter(card => validColors.includes(card.color))

      const melded = game.actions.chooseAndMeld(player, meldChoices)

      if (!melded || (Array.isArray(melded) && melded.length === 0)) {
        game.aYouLose(player, self)
        return
      }
    },
  ],
}
