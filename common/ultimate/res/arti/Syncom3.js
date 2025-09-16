const util = require('../../../lib/util.js')
const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Syncom 3`,
  color: `green`,
  age: 9,
  expansion: `arti`,
  biscuits: `hiii`,
  dogmaBiscuit: `i`,
  dogma: [
    `Return all cards from your hand. Draw and reveal five {9}. If you revealed all five colors, you win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
      const drawn = [
        game.aDrawAndReveal(player, game.getEffectAge(self, 9)),
        game.aDrawAndReveal(player, game.getEffectAge(self, 9)),
        game.aDrawAndReveal(player, game.getEffectAge(self, 9)),
        game.aDrawAndReveal(player, game.getEffectAge(self, 9)),
        game.aDrawAndReveal(player, game.getEffectAge(self, 9)),
      ].filter(card => card !== undefined)

      const colors = drawn.map(card => card.color)
      const colorCount = util.array.distinct(colors).length
      game.mLog({ template: `Player drew ${colorCount} colors`})
      if (colorCount === 5) {
        throw new GameOverEvent({
          player,
          reason: self.name
        })
      }
    }
  ],
}
