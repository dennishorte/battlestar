const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  id: `Shigeru Miyamoto`,  // Card names are unique in Innovation
  name: `Shigeru Miyamoto`,
  color: `yellow`,
  age: 10,
  expansion: `figs`,
  biscuits: `hai&`,
  dogmaBiscuit: `i`,
  echo: `Draw and reveal a {0}. If it does not have a {i}, score it.`,
  karma: [
    `If you would take a Dogma action and activate a card whose featured biscuit is {i}, first if you have exactly one, three, or six {i} on your board, you win.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    const card = game.aDrawAndReveal(player, game.getEffectAge(this, 10))
    if (!card.checkHasBiscuit('i')) {
      game.aScore(player, card)
    }
    else {
      game.mLog({
        template: '{card} has a clock biscuit; do not score',
        args: { card }
      })
    }
  },
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: (game, player, { card }) => card.checkHasBiscuit('i'),
      func: (game, player) => {
        const clocks = game.getBiscuitsByPlayer(player).i
        if (clocks === 1 || clocks === 3 || clocks === 6) {
          throw new GameOverEvent({
            player,
            reason: this.name
          })
        }
        else {
          game.mLogNoEffect()
        }
      }
    }
  ]
}
