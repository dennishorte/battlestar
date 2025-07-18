module.exports = {
  name: `Medicine`,
  color: `yellow`,
  age: 3,
  expansion: `base`,
  biscuits: `cllh`,
  dogmaBiscuit: `l`,
  dogma: [
    `I demand you exchange the highest card in your score pile with the lowest card in my score pile!`,
    `Junk an available achievement of value 3 or 4.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const highest = game.utilHighestCards(game.cards.byPlayer(player, 'score'))
      const lowest = game.utilLowestCards(game.cards.byPlayer(leader, 'score'))

      const highestCards = game.actions.chooseCards(player, highest)
      const lowestCards = game.actions.chooseCards(player, lowest)

      game.aExchangeCards(
        player,
        highestCards,
        lowestCards,
        game.zones.byPlayer(player, 'score'),
        game.zones.byPlayer(leader, 'score'),
      )
    },

    (game, player) => {
      game.aJunkAvailableAchievement(player, [3, 4])
    }
  ],
}
