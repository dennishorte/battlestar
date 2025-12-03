module.exports = {
  id: `Taki ad-Din`,  // Card names are unique in Innovation
  name: `Taki ad-Din`,
  color: `blue`,
  age: 4,
  expansion: `figs`,
  biscuits: `pllh`,
  dogmaBiscuit: `l`,
  karma: [
    `You may issue an Advancement Decree with any two figures.`,
    `If you would take a Draw action, instead draw and reveal a {5}, and splay its color on your board right. If the drawn card has {s}, meld it.`,
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement',
    },
    {
      trigger: 'draw-action',
      kind: 'would-instead',
      matches: () => true,
      func: (game, player, { self }) => {
        const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 5))
        game.actions.splay(player, card.color, 'right')
        if (card.checkHasBiscuit('s')) {
          game.actions.meld(player, card)
        }
      }
    }
  ]
}
