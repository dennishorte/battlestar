const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Seikan Tunnel`,
  color: `green`,
  age: 10,
  expansion: `arti`,
  biscuits: `iiih`,
  dogmaBiscuit: `i`,
  dogma: [
    `If you have the most cards of a color showing on your board out of all colors on all boards, you win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const zones = game
        .getPlayerAll()
        .flatMap(player => game.utilColors().map(color => {
          return {
            player,
            color,
            count: game.getVisibleCardsByZone(player, color),
          }
        }))
        .sort((l, r) => r.count - l.count)

      if (
        zones[0].count > zones[1].count
        && zones[0].player === player
      ) {
        throw new GameOverEvent({
          player,
          reason: self.name
        })
      }

      else {
        game.mLogNoEffect()
      }
    }
  ],
}
