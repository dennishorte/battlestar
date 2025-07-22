module.exports = {
  name: `Exile`,
  color: `yellow`,
  age: 2,
  expansion: `usee`,
  biscuits: `lhlk`,
  dogmaBiscuit: `l`,
  dogma: [
    `I demand you return a top card without {l} from your board! Return all cards of the returned card's value from your score pile!`,
    `If exactly one card was returned due to the demand, return Exile if it is a top card on any board and draw a {3}.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .getTopCards(player)
        .filter(card => !card.checkHasBiscuit('l'))

      const returned = game.actions.chooseAndReturn(player, choices, { count: 1 })[0]

      if (returned) {
        const scoreCards = game
          .cards.byPlayer(player, 'score')
          .filter(card => card.age === returned.age)

        const scored = game.actions.returnMany(player, scoreCards)

        if (scored.length === 0) {
          game.state.dogmaInfo.exileReturnedOneCard = true
        }
      }
    },
    (game, player, { self }) => {
      if (game.state.dogmaInfo.exileReturnedOneCard) {
        const topCards = game
          .players.all()
          .flatMap(player => game.getTopCards(player))

        const exileCards = topCards.filter(card => card.name === 'Exile')
        if (exileCards.length > 0) {
          game.actions.return(player, exileCards[0])
          game.aDraw(player, { age: game.getEffectAge(self, 3) })
        }
      }
    }
  ],
}
