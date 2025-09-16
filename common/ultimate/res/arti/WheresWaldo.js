const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Where's Waldo`,
  color: `yellow`,
  age: 10,
  expansion: `arti`,
  biscuits: `lihl`,
  dogmaBiscuit: `l`,
  dogma: [
    `You win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      throw new GameOverEvent({
        player,
        reason: self.name
      })
    }
  ],
}
