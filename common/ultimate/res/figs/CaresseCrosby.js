
module.exports = {
  id: `Caresse Crosby`,  // Card names are unique in Innovation
  name: `Caresse Crosby`,
  color: `yellow`,
  age: 8,
  expansion: `figs`,
  biscuits: `lh8*`,
  dogmaBiscuit: `l`,
  echo: ``,
  karma: [
    `If you would tuck a card with a {l}, first splay that color of your cards left, then draw two {2}.`,
    `If you would splay a fifth color left [with another card], instead you win.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'tuck',
      kind: 'would-first',
      matches(game, player, { card }) {
        return card.biscuits.includes('l')
      },
      func: (game, player, { card }) => {
        game.aSplay(player, card.color, 'left')
        game.actions.draw(player, { age: game.getEffectAge(this, 2) })
        game.actions.draw(player, { age: game.getEffectAge(this, 2) })
      },
    },
    {
      trigger: 'splay',
      kind: 'would-instead',
      matches(game, player, { color, direction }) {
        const toSplayLeftCondition = direction === 'left'
        const notLeftCondition = game.zones.byPlayer(player, color).splay !== 'left'
        const leftCondition = game
          .utilColors()
          .filter(other => other !== color)
          .map(color => game.zones.byPlayer(player, color).splay)
          .filter(splay => splay === 'left')
          .length === 4
        return toSplayLeftCondition && leftCondition && notLeftCondition
      },
      func(game, player) {
        game.youWin(player, 'Caresse Crosby')
      }
    },
  ]
}
