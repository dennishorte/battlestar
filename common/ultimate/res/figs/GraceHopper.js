
module.exports = {
  id: `Grace Hopper`,  // Card names are unique in Innovation
  name: `Grace Hopper`,
  color: `blue`,
  age: 9,
  expansion: `figs`,
  biscuits: `sh9*`,
  dogmaBiscuit: `s`,
  karma: [
    `If another player would not draw a card for sharing after a Dogma action, first draw and reveal a {0}. If it is blue, you win.`
  ],
  karmaImpl: [
    {
      trigger: 'no-share',
      triggerAll: true,
      kind: 'would-first',
      matches: (game, player) => {
        return player === game.getPlayerByCard(this)
      },
      func: (game, player) => {
        const card = game.actions.draw(player, { age: game.getEffectAge(this, 10) })
        if (card && card.color === 'blue') {
          game.mReveal(player, card)
          game.youWin(player, this.name)
        }
      }
    }
  ]
}
