module.exports = {
  id: `Plato`,  // Card names are unique in Innovation
  name: `Plato`,
  color: `purple`,
  age: 2,
  expansion: `figs`,
  biscuits: `shsp`,
  dogmaBiscuit: `s`,
  karma: [
    `You may issue a Rivalry Decree with any two figures.`,
    `If you would dogma a card as your first action, first splay the card's color left. If you don't, junk an available achievement of value 2.`,
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry',
    },
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: (game) => game.state.actionNumber === 1,
      func(game, player, { card }) {
        const didSplay = game.actions.splay(player, card.color, 'left')

        if (!didSplay) {
          game.actions.junkAvailableAchievement(player, 2)
        }
      }
    }
  ]
}
