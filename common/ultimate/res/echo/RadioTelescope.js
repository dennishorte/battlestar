const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Radio Telescope`,
  color: `blue`,
  age: 8,
  expansion: `echo`,
  biscuits: `hsss`,
  dogmaBiscuit: `s`,
  echo: ``,
  dogma: [
    `For every two {s} on your board, draw a {9}. Meld one of the cards drawn and return the rest. If you meld AI due to this dogma effect, you win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const count = Math.floor(game.getBiscuitsByPlayer(player).s / 2)
      const drawn = []
      for (let i = 0; i < count; i++) {
        const card = game.actions.draw(player, { age: game.getEffectAge(self, 9) })
        if (card) {
          drawn.push(card)
        }
      }

      const melded = game.actions.chooseAndMeld(player, drawn)

      if (melded.length > 0 && melded[0].name === 'A.I.') {
        throw new GameOverEvent({
          player,
          reason: self.name
        })
      }

      const toReturn = drawn.filter(card => card !== melded[0])
      game.actions.returnMany(player, toReturn)
    }
  ],
  echoImpl: [],
}
