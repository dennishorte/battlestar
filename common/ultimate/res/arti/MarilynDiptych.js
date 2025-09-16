const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Marilyn Diptych`,
  color: `purple`,
  age: 9,
  expansion: `arti`,
  biscuits: `ccch`,
  dogmaBiscuit: `c`,
  dogma: [
    `You may score a card from your hand. You may transfer any card from your score pile to your hand. If you have exactly 25 points, you win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.aChooseAndScore(player, game.getCardsByZone(player, 'hand'), { min: 0, max: 1 })
      game.aChooseAndTransfer(player, game.getCardsByZone(player, 'score'), game.getZoneByPlayer(player, 'hand'), { min: 0, max: 1 })

      if (game.getScore(player) === 25) {
        throw new GameOverEvent({
          player,
          reason: self.name
        })
      }
    }
  ],
}
