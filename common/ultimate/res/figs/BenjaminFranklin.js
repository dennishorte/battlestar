module.exports = {
  id: `Benjamin Franklin`,  // Card names are unique in Innovation
  name: `Benjamin Franklin`,
  color: `blue`,
  age: 6,
  expansion: `figs`,
  biscuits: `s&h6`,
  dogmaBiscuit: `s`,
  karma: [
    `You may issue an Advancement Decree with any two figures.`,
    `If you would meld a card, first draw and meld a card of one higher value.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement',
    },
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: () => true,
      func(game, player, { card }) {
        game.actions.drawAndMeld(player, card.getAge() + 1)
      }
    }
  ]
}
