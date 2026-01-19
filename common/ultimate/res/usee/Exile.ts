export default {
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
      if (!game.state.dogmaInfo.exileCount) {
        game.state.dogmaInfo.exileCount = 0
      }

      const choices = game
        .cards.tops(player)
        .filter(card => !card.checkHasBiscuit('l'))

      const returned = game.actions.chooseAndReturn(player, choices, { count: 1 })[0]

      if (returned) {
        game.state.dogmaInfo.exileCount += 1

        const scoreCards = game
          .cards
          .byPlayer(player, 'score')
          .filter(card => card.age === returned.age)

        const scored = game.actions.returnMany(player, scoreCards)
        game.state.dogmaInfo.exileCount += scored.length
      }
    },
    (game, player, { self }) => {
      if (game.state.dogmaInfo.exileCount === 1) {
        const topCards = game
          .players
          .all()
          .flatMap(player => game.cards.tops(player))

        const exileCards = topCards.filter(card => card.name === 'Exile')
        if (exileCards.length > 0) {
          game.actions.return(player, exileCards[0])
          game.actions.draw(player, { age: game.getEffectAge(self, 3) })
        }
      }
    }
  ],
}
