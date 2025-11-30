module.exports = {
  id: `Sejong the Great`,  // Card names are unique in Innovation
  name: `Sejong the Great`,
  color: `blue`,
  age: 3,
  expansion: `figs`,
  biscuits: `p3hs`,
  dogmaBiscuit: `s`,
  karma: [
    `You may issue an advancement decree with any two figures.`,
    `If you would meld a card of value equal to your top red card, instead return it and draw and meld a card of value one higher.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement',
    },
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player, { card }) => {
        const topRed = game.cards.top(player, 'red')
        return topRed && topRed.getAge() === card.getAge()
      },
      func: (game, player, { card }) => {
        game.actions.return(player, card)
        game.actions.drawAndMeld(player, card.getAge() + 1)
      }
    }
  ]
}
