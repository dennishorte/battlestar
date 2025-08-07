module.exports = {
  name: `Joy Buzzer`,
  color: `purple`,
  age: 8,
  expansion: `usee`,
  biscuits: `icih`,
  dogmaBiscuit: `i`,
  dogma: [
    `I demand you exchange all cards in your hand with all the lowest cards in my hand!`,
    `You may choose a value and score all the cards in your hand of that value. If you do, score your top purple card.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const playerHand = game.zones.byPlayer(player, 'hand')
      const leaderHand = game.zones.byPlayer(leader, 'hand')

      const playerCards = playerHand.cardlist()
      const leaderLowest = game.util.lowestCards(leaderHand.cardlist())

      game.aExchangeCards(player, playerCards, leaderLowest, playerHand, leaderHand)
    },
    (game, player) => {
      const age = game.actions.chooseAge(player, null, { min: 0 })
      const cardsOfAge = game.cards.byPlayer(player, 'hand').filter(c => c.getAge() === age)
      game.actions.scoreMany(player, cardsOfAge)

      const topPurple = game.getTopCard(player, 'purple')
      if (topPurple) {
        game.actions.score(player, topPurple)
      }
    }
  ],
}
