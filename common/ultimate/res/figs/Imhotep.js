module.exports = {
  id: `Imhotep`,  // Card names are unique in Innovation
  name: `Imhotep`,
  color: `blue`,
  age: 1,
  expansion: `figs`,
  biscuits: `khk&`,
  dogmaBiscuit: `k`,
  karma: [
    `If you would meld a card over an unsplayed color with more than one card, instead splay that color left and return the card.`
  ],
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player, { card }) => {
        const zone = game.zones.byPlayer(player, card.color)
        return zone.cards().length > 1 && zone.splay === 'none'
      },
      func: (game, player, { card }) => {
        game.actions.splay(player, card.color, 'left')
        game.actions.return(player, card)
      }
    }
  ]
}
