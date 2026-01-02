module.exports = {
  id: `Isaac Newton`,  // Card names are unique in Innovation
  name: `Isaac Newton`,
  color: `blue`,
  age: 5,
  expansion: `figs`,
  biscuits: `hsps`,
  dogmaBiscuit: `s`,
  karma: [
    `If you would take a Draw action, first draw and reveal a {1} and transfer it to any player's board.`,
    `If you would dogma a card, first splay right every color on your board with a top card of that card's value.`,
  ],
  karmaImpl: [
    {
      trigger: 'draw-action',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { self }) => {
        const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 1))
        const targetPlayer = game.actions.choosePlayer(player, game.players.all())
        const target = game.zones.byPlayer(targetPlayer, card.color)
        game.actions.transfer(player, card, target)
      }
    },
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card }) => {
        for (const color of game.util.colors()) {
          const topCard = game.cards.top(player, color)
          if (topCard && topCard.getAge() === card.getAge()) {
            game.actions.splay(player, color, 'right')
          }
        }
      }
    }
  ]
}
