const util = require('../../../lib/util.js')

module.exports = {
  name: `Handshake`,
  color: `yellow`,
  age: 1,
  expansion: `usee`,
  biscuits: `hckk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I demand you transfer all cards from my hand to your hand! Choose two colors of cards in your hand! Transfer all cards in your hand of those colors to my hand!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      // Transfer all cards from leader's hand to player's hand
      const leaderHand = game.zones.byPlayer(leader, 'hand')
      const leaderCards = leaderHand.cardlist()
      game.actions.transferMany(leader, leaderCards, game.zones.byPlayer(player, 'hand'), { ordered: true })

      // Have player choose two colors
      const handColors = game
        .cards.byPlayer(player, 'hand')
        .map(c => c.color)
      const uniqueColors = util.array.distinct(handColors).sort()
      const chosenColors = game.actions.choose(player, uniqueColors, { count: 2 })

      // Transfer all cards of chosen colors from player's hand to leader's hand
      const playerHand = game.zones.byPlayer(player, 'hand')
      const transferCards = playerHand.cardlist().filter(card => chosenColors.includes(card.color))
      game.actions.transferMany(player, transferCards, leaderHand, { ordered: true })
    },
  ],
}
