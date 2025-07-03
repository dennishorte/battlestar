const { GameOverEvent } = require('../../../lib/game.js')


module.exports = {
  name: `A.I.`,
  color: `purple`,
  age: 10,
  expansion: `base`,
  biscuits: `ssih`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw and score a {0}.`,
    `If Robotics and Software are top cards on any board, the single player with the lowest score wins.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.aDrawAndScore(player, game.getEffectAge(self, 10))
    },
    (game) => {
      const conditionMet  = game
        .players.all()
        .flatMap(player => game.getTopCards(player))
        .filter(card => card.name === 'Robotics' || card.name === 'Software')
        .length === 2

      if (conditionMet) {
        const playerScores = game
          .players.all()
          .map(player => ({ player, score: game.getScore(player) }))
          .sort((l, r) => l.score - r.score)

        if (playerScores[0].score < playerScores[1].score) {
          throw new GameOverEvent({
            reason: 'A.I.',
            player: playerScores[0].player,
          })
        }
        else {
          game.log.addNoEffect()
        }
      }
    },
  ],
}
