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

      const playerCards = playerHand.cards()
      const leaderLowest = game.utilLowestCards(leaderHand.cards())

      game.aExchangeCards(player, playerCards, leaderLowest, playerHand, leaderHand)
    },
    (game, player) => {
      const age = game.aChooseAge(player)
      const cardsOfAge = game.getCardsByZone(player, 'hand').filter(c => c.getAge() === age)
      game.aScoreMany(player, cardsOfAge)

      const topPurple = game.getTopCard(player, 'purple')
      if (topPurple) {
        game.aScore(player, topPurple)
      }
    }
  ],
}
