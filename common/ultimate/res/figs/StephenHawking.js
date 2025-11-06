module.exports = {
  id: `Stephen Hawking`,  // Card names are unique in Innovation
  name: `Stephen Hawking`,
  color: `blue`,
  age: 10,
  expansion: `figs`,
  biscuits: `b*sh`,
  dogmaBiscuit: `s`,
  karma: [
    `Each {h} on your board also counts as an echo effect reading "Score the bottom card of this color".`
  ],
  karmaImpl: [
    {
      trigger: 'hex-effect',
      triggerAll: true,
      matches: (game, player, { card }) => {
        // Only affects cards that are on the same board as Stephen Hawking.
        return game.getPlayerByCard(this) === game.getPlayerByCard(card)
      },

      // Note that player here is the owner of Stephen Hawking and card is a card in a stack
      // that has a visible hex, and so gets this extra echo effect.
      func: (game, player, { card }) => {
        return {
          text: 'Score the bottom card of this color.',
          impl: (game, player) => {
            const cards = game.zones.byPlayer(player, card.color).cards()
            if (cards.length === 0) {
              game.log.addNoEffect()
            }
            else {
              game.actions.score(player, cards[cards.length - 1])
            }
          }
        }
      }
    }
  ]
}
