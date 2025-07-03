const { GameOverEvent } = require('../../../lib/game.js')


module.exports = {
  name: `Globalization`,
  color: `yellow`,
  age: 10,
  expansion: `base`,
  biscuits: `hfff`,
  dogmaBiscuit: `f`,
  dogma: [
    `I demand you return a top card with a {l} from your board!`,
    `Draw and meld an {e}. If no player has more {l} than {f} on their board, the single player with the most points wins.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .getTopCards(player)
        .filter(c => c.checkBiscuitIsVisible('l', 'top'))
        .map(c => c.id)
      const card = game.actions.chooseCard(player, choices)

      if (card) {
        game.aReturn(player, card)
      }
    },

    (game, player, { self }) => {
      game.aDrawAndMeld(player, game.getEffectAge(self, 11))

      game.log.add({ template: 'Checking win condition' })

      const biscuitCounts = Object.values(game.getBiscuits())
      const conditionMet = biscuitCounts
        .filter(({ l, f }) => l > f)
        .length === 0

      if (conditionMet) {
        const playersByScore = game
          .players.all()
          .map(p => ({ player: p, score: game.getScore(p) }))
          .sort((l, r) => r.score - l.score)

        if (playersByScore[0].score > playersByScore[1].score) {
          throw new GameOverEvent({
            reason: 'Globalization',
            player: playersByScore[0].player
          })
        }
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
}
