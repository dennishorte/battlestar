module.exports = {
  id: `Cai Lun`,  // Card names are unique in Innovation
  name: `Cai Lun`,
  color: `yellow`,
  age: 2,
  expansion: `figs`,
  biscuits: `pcch`,
  dogmaBiscuit: `c`,
  karma: [
    `If a player would score a card, first splay all colors on your board left.`,
    `Each top card on your board of a color not splayed counts as an available achievement for you.`,
  ],
  karmaImpl: [
    {
      trigger: 'score',
      triggerAll: true,
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { owner }) => {
        for (const color of game.util.colors()) {
          game.actions.splay(owner, color, 'left')
        }
      }
    },
    {
      trigger: 'list-achievements',
      func(game, player) {
        const cards = []
        for (const color of game.util.colors()) {
          const zone = game.zones.byPlayer(player, color)
          if (zone.splay === 'none' && zone.cardlist().length > 0) {
            cards.push(game.cards.top(player, color))
          }
        }
        return cards
      }
    }
  ]
}
