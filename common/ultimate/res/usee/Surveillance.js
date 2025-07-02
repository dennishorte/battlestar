const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Surveillance`,
  color: `yellow`,
  age: 9,
  expansion: `usee`,
  biscuits: `siih`,
  dogmaBiscuit: `i`,
  dogma: [
    `I demand you reveal your hand! If each color present in my hand is present in yours, and vice versa, and your hand is not empty, I win!`,
    `Draw a {0}.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const leaderHand = game.getCardsByZone(leader, 'hand')
      const leaderColors = [...new Set(leaderHand.map(card => card.color))]

      const playerHand = game.getCardsByZone(player, 'hand')
      const playerColors = [...new Set(playerHand.map(card => card.color))]

      if (playerHand.length === 0) {
        game.log.addNoEffect()
        return
      }

      game.aRevealMany(player, playerHand, { ordered: true })
      game.aRevealMany(player, leaderHand, { ordered: true })


      if (leaderColors.every(color => playerColors.includes(color)) &&
          playerColors.every(color => leaderColors.includes(color))) {
        throw new GameOverEvent({
          player: leader,
          reason: self.name
        })
      }
    },

    (game, player, { self }) => {
      game.aDraw(player, { age: game.getEffectAge(self, 10) })
    }
  ],
}
