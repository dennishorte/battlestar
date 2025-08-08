const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Saxophone`,
  color: `purple`,
  age: 7,
  expansion: `echo`,
  biscuits: `7cm7`,
  dogmaBiscuit: `c`,
  echo: ``,
  dogma: [
    `You may splay your purple cards up.`,
    `If the {m} for Bell, Flute, Piano, and Saxophone are visible anywhere, you win. Otherwise, draw a {7} for each {m} that is visible.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.aChooseAndSplay(player, ['purple'], 'up')
    },

    (game, player) => {
      let count = 0

      for (const player of game.getPlayerAll()) {
        for (const color of game.utilColors()) {
          const zone = game.getZoneByPlayer(player, color)
          const cards = zone.cards()

          // Top card
          if (cards[0] && cards[0].checkHasBiscuit('m')) {
            count += 1
          }

          // Everything else
          count += cards
            .slice(1)
            .filter(card => card.checkHasBiscuit('m'))
            .length
        }
      }

      if (count === 4) {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      }
      else {
        for (let i = 0; i < count; i++) {
          game.aDraw(player, { age: game.getEffectAge(this, 7) })
        }
      }
    },
  ],
  echoImpl: [],
}
