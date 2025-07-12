module.exports = {
  name: `Education`,
  color: `purple`,
  age: 3,
  expansion: `base`,
  biscuits: `sssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `You may return the highest card from your score pile. If you do, draw a card of value two higher than the highest card remaining in your score pile.`
  ],
  dogmaImpl: [
    (game, player) => {
      const returnCard = game.actions.chooseYesNo(player, 'Return the highest card from your score pile?')
      if (returnCard) {
        const highestCards = game.utilHighestCards(game.cards.byPlayer(player, 'score'))
        const cards = game.aChooseAndReturn(player, highestCards)

        if (cards.length > 0) {
          const newHighest = game.utilHighestCards(game.cards.byPlayer(player, 'score'))
          const age = newHighest.length > 0 ? newHighest[0].getAge() + 2 : 2
          game.aDraw(player, { age })
        }
      }
      else {
        game.log.addDoNothing(player)
      }
    }
  ],
}
