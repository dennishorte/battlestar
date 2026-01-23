module.exports = {
  id: `Therese Kirongozi`,  // Card names are unique in Innovation
  name: `Therese Kirongozi`,
  color: `yellow`,
  age: 11,
  expansion: `figs`,
  biscuits: `cbhp`,
  dogmaBiscuit: `c`,
  karma: [
    `If an opponent would take a Dogma action, instead the opponent draws, reveals, and returns a card of any value. The opponent super-executes their top card of the revealed card's color, if there is one.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      triggerAll: true,
      kind: 'would-instead',
      matches: (game, player, { owner }) => player.isOpponent(owner),
      func: (game, player, { self }) => {
        const age = game.actions.chooseAge(player, game.getAges())
        const card = game.actions.drawAndReveal(player, age)
        game.actions.return(player, card)

        const topCard = game.cards.top(player, card.color)
        if (topCard) {
          game.actions.superExecute(self, player, topCard)
        }
      }
    }
  ]
}
