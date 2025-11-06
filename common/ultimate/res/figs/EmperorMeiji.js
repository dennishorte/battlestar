
module.exports = {
  id: `Emperor Meiji`,  // Card names are unique in Innovation
  name: `Emperor Meiji`,
  color: `purple`,
  age: 7,
  expansion: `figs`,
  biscuits: `hii*`,
  dogmaBiscuit: `i`,
  karma: [
    `If you would meld a card of value 10 and you have top cards of values 9 and 8 on your board, instead you win.`,
    `Each card in your forecast counts as being in your hand.`
  ],
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player, { card }) => {
        const cardCondition = card.getAge() === 10
        const nineCondition = game
          .cards.tops(player)
          .filter(card => card.getAge() === 9)
          .length > 0
        const eightCondition = game
          .cards.tops(player)
          .filter(card => card.getAge() === 8)
          .length > 0
        return cardCondition && nineCondition && eightCondition
      },
      func: (game, player) => {
        game.youWin(player, 'Emperor Meiji')
      }
    },

    {
      trigger: 'list-hand',
      func: (game, player) => {
        return [
          ...game.zones.byPlayer(player, 'hand')._cards,
          ...game.zones.byPlayer(player, 'forecast')._cards,
        ]
      }
    }
  ]
}
