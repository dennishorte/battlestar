module.exports = {
  id: `Catherine the Great`,  // Card names are unique in Innovation
  name: `Catherine the Great`,
  color: `purple`,
  age: 6,
  expansion: `figs`,
  biscuits: `*ssh`,
  dogmaBiscuit: `s`,
  echo: ``,
  karma: [
    `Each {s} on your board provides two additional {s}.`,
    `If you would meld a purple card, first transfer your top purple card into your hand.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'calculate-biscuits',
      func(game, player, { biscuits }) {
        const extra = game.utilEmptyBiscuits()
        extra.s = biscuits.s * 2
        return extra
      }
    },

    {
      trigger: 'meld',
      matches(game, player, { card }) {
        return card.color === 'purple'
      },
      func(game, player) {
        const card = game.getTopCard(player, 'purple')
        game.aTransfer(player, card, game.getZoneByPlayer(player, 'hand'))
      },
    }
  ]
}
