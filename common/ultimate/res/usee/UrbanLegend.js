const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Urban Legend`,
  color: `purple`,
  age: 9,
  expansion: `usee`,
  biscuits: `fhff`,
  dogmaBiscuit: `f`,
  dogma: [
    `For every color on your board with {f}, draw a {9}. If you draw five cards, you win.`,
    `You may splay your yellow or purple cards up.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const colors = ['red', 'yellow', 'green', 'blue', 'purple']
      let drawnCards = 0
      colors.forEach(color => {
        const zone = game.zones.byPlayer(player, color)
        if (game.getBiscuitsByZone(zone).f > 0) {
          game.actions.draw(player, { age: game.getEffectAge(self, 9) })
          drawnCards++
        }
      })

      if (drawnCards === 5) {
        throw new GameOverEvent({
          player,
          reason: self.name
        })
      }
    },
    (game, player) => {
      game.actions.chooseAndSplay(player, ['yellow', 'purple'], 'up')
    }
  ],
}
