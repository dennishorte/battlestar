module.exports = {
  id: `Su Song`,  // Card names are unique in Innovation
  name: `Su Song`,
  color: `green`,
  age: 3,
  expansion: `figs`,
  biscuits: `cph3`,
  dogmaBiscuit: `c`,
  karma: [
    `You may issue a Trade Decree with any two figures.`,
    `If you would meld a card, first draw and meld a {3}. If the drawn card has no {l}, return it.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Trade',
    },
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { self }) => {
        const card = game.actions.drawAndMeld(player, game.getEffectAge(self, 3))
        if (!card.checkHasBiscuit('l')) {
          game.actions.return(player, card)
        }
      }
    }
  ]
}
