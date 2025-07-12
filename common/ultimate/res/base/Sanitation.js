module.exports = {
  name: `Sanitation`,
  color: `yellow`,
  age: 7,
  expansion: `base`,
  biscuits: `llhl`,
  dogmaBiscuit: `l`,
  dogma: [
    `I demand you exchange the two highest cards in your hand with the lowest card in my hand!`,
    `Choose {7} or {8}. Junk all cards in that deck.`,
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const playerHand = game.zones.byPlayer(player, 'hand')
      const leaderHand = game.zones.byPlayer(leader, 'hand')
      const highest = game.aChooseHighest(player, playerHand.cards(), 2)
      const lowest = game.aChooseLowest(leader, leaderHand.cards(), 1)

      game.aExchangeCards(
        player,
        highest,
        lowest,
        playerHand,
        leaderHand,
      )
    },

    (game, player) => {
      const age = game.aChooseAge(player, [7, 8])
      game.aJunkDeck(player, age)
    },
  ],
}
