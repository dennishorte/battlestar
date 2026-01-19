export default {
  id: `George Stephenson`,  // Card names are unique in Innovation
  name: `George Stephenson`,
  color: `green`,
  age: 7,
  expansion: `figs`,
  biscuits: `7pfh`,
  dogmaBiscuit: `f`,
  karma: [
    `If you would dogma a card of a color you have splayed right, first splay that color on your board up.`,
    `If you would claim an achievement, first transfer the bottom yellow card on each board to the available achievements.`,
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: (game, player, { card }) => game.zones.byPlayer(player, card.color).splay === 'right',
      func: (game, player, { card }) => {
        game.actions.splay(player, card.color, 'up')
      }
    },
    {
      trigger: 'achieve',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const toTransfer = game
          .players
          .all()
          .map(p => game.cards.bottom(p, 'yellow'))
          .filter(card => Boolean(card))
        game.actions.transferMany(player, toTransfer, game.zones.byId('achievements'))
      }
    }
  ]
}
