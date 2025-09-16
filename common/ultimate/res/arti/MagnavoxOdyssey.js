const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Magnavox Odyssey`,
  color: `yellow`,
  age: 9,
  expansion: `arti`,
  biscuits: `slhs`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw and meld two {0}. If they are the same color, you win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card1 = game.aDrawAndMeld(player, game.getEffectAge(self, 10))
      const card2 = game.aDrawAndMeld(player, game.getEffectAge(self, 10))

      if (card1.color === card2.color) {
        throw new GameOverEvent({
          player,
          reason: self.name
        })
      }
      else {
        game.mLog({ template: 'Colors do not match' })
      }
    }
  ],
}
