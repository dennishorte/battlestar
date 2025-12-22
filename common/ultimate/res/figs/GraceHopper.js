module.exports = {
  id: `Grace Hopper`,  // Card names are unique in Innovation
  name: `Grace Hopper`,
  color: `blue`,
  age: 9,
  expansion: `figs`,
  biscuits: `sh9p`,
  dogmaBiscuit: `s`,
  karma: [
    `If an opponent would not draw a card for sharing after a Dogma action, first draw and reveal a {0}. If it is blue, you win.`
  ],
  karmaImpl: [
    {
      trigger: 'no-share',
      triggerAll: true,
      kind: 'would-first',
      matches: (game, player, { owner, self }) => {
        return player.isOpponent(owner)
      },
      func: (game, player, { owner, self }) => {
        const card = game.actions.drawAndReveal(owner, game.getEffectAge(self, 10))
        if (card.color === 'blue') {
          game.youWin(owner, self.name)
        }
      }
    }
  ]
}
