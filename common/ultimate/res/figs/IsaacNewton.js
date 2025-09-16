module.exports = {
  id: `Isaac Newton`,  // Card names are unique in Innovation
  name: `Isaac Newton`,
  color: `blue`,
  age: 5,
  expansion: `figs`,
  biscuits: `hs&s`,
  dogmaBiscuit: `s`,
  echo: `Splay one color of your cards right.`,
  karma: [
    `If you would take a Draw or Inspire action, first draw and reveal a {1} and transfer it to any player's board.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    game.actions.chooseAndSplay(player, null, 'right')
  },
  karmaImpl: [
    {
      trigger: ['draw-action', 'inspire'],
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const card = game.actions.drawAndReveal(player, game.getEffectAge(this, 1))
        const targetPlayer = game.actions.choosePlayer(player, game.players.all().map(p => p.name))
        const target = game.zones.byPlayer(targetPlayer, card.color)
        game.actions.transfer(player, card, target)
      }
    }
  ]
}
