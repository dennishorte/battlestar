module.exports = {
  id: `Yi Sun-Sin`,  // Card names are unique in Innovation
  name: `Yi Sun-Sin`,
  color: `red`,
  age: 4,
  expansion: `figs`,
  biscuits: `4hf&`,
  dogmaBiscuit: `f`,
  karma: [
    `If you would score a card of a color you have splayed, instead tuck it, then draw a {3}.`
  ],
  karmaImpl: [
    {
      trigger: 'score',
      kind: 'would-instead',
      matches(game, player, { card }) {
        const zone = game.zones.byPlayer(player, card.color)
        return zone.splay !== 'none'
      },
      func: (game, player, { card }) => {
        game.actions.tuck(player, card)
        game.actions.draw(player, { age: game.getEffectAge(this, 3) })
      }
    }
  ]
}
