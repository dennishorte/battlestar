const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Slot Machine`,
  color: `purple`,
  age: 7,
  expansion: `usee`,
  biscuits: `fiih`,
  dogmaBiscuit: `i`,
  dogma: [
    `Draw and reveal a {1}, {2}, {3}, {4}, and {5}. If at least one drawn card is green, splay your green or purple cards right. If at least two are, score all drawn cards, otherwise return them. If at least three are, you win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const drawnCards = [
        game.aDrawAndReveal(player, game.getEffectAge(self, 1)),
        game.aDrawAndReveal(player, game.getEffectAge(self, 2)),
        game.aDrawAndReveal(player, game.getEffectAge(self, 3)),
        game.aDrawAndReveal(player, game.getEffectAge(self, 4)),
        game.aDrawAndReveal(player, game.getEffectAge(self, 5))
      ]

      const numGreen = drawnCards.filter(card => card.color === 'green').length

      if (numGreen >= 3) {
        throw new GameOverEvent({ player, reason: self.name })
      }

      if (numGreen >= 1) {
        game.aChooseAndSplay(player, ['green', 'purple'], 'right', { count: 1 })
      }

      if (numGreen >= 2) {
        game.aScoreMany(player, drawnCards)
      }
      else {
        game.aReturnMany(player, drawnCards)
      }
    },
  ],
}
