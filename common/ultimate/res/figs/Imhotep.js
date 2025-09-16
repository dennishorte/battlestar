module.exports = {
  id: `Imhotep`,  // Card names are unique in Innovation
  name: `Imhotep`,
  color: `blue`,
  age: 1,
  expansion: `figs`,
  biscuits: `khk&`,
  dogmaBiscuit: `k`,
  echo: `Draw and meld a {2}.`,
  karma: [
    `If you would meld a card over an unsplayed color with more than one card, instead splay that color left and return the card.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    game.aDrawAndMeld(player, game.getEffectAge(this, 2))
  },
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player, { card }) => {
        const zone = game.getZoneByPlayer(player, card.color)
        return zone.cards().length > 1 && zone.splay === 'none'
      },
      func: (game, player, { card }) => {
        game.aSplay(player, card.color, 'left')
        game.aReturn(player, card)
      }
    }
  ]
}
