module.exports = {
  id: `Catherine the Great`,  // Card names are unique in Innovation
  name: `Catherine the Great`,
  color: `purple`,
  age: 6,
  expansion: `figs`,
  biscuits: `pssh`,
  dogmaBiscuit: `s`,
  karma: [
    `Each {s} on your board provides one additional {s} and one additional {i}`,
    `If a player would meld a card, first that player transfers their top card of the same color to their hand.`
  ],
  karmaImpl: [
    {
      trigger: 'calculate-biscuits',
      func(game, player, { biscuits }) {
        const extra = game.util.emptyBiscuits()
        extra.s = biscuits.s
        extra.i = biscuits.s  // Each {s} provides one additional {i}
        return extra
      }
    },

    {
      trigger: 'meld',
      triggerAll: true,
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card }) => {
        const top = game.cards.top(player, card.color)
        if (top && top !== card) {
          game.actions.transfer(player, top, game.zones.byPlayer(player, 'hand'))
        }
      },
    }
  ]
}
