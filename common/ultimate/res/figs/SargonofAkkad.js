module.exports = {
  id: `Sargon of Akkad`,  // Card names are unique in Innovation
  name: `Sargon of Akkad`,
  color: `green`,
  age: 1,
  expansion: `figs`,
  biscuits: `1ch*`,
  dogmaBiscuit: `c`,
  karma: [
    `If you would meld a card, and your current top card of that color is of equal value, instead tuck it.`
  ],
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player, { card }) => {
        const cards = game.cards.byPlayer(player, card.color)
        return cards.length > 0 && cards[0].getAge() === card.getAge()
      },
      func: (game, player, { card }) => {
        game.actions.tuck(player, card)
      }
    }
  ]
}
