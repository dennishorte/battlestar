
const util = require('../../../lib/util.js')

module.exports = {
  name: `Telegraph`,
  color: `green`,
  age: 7,
  expansion: `echo`,
  biscuits: `hiis`,
  dogmaBiscuit: `i`,
  echo: [],
  dogma: [
    `You may choose an opponent and a color. Match your splay in that color to theirs.`,
    `You may splay your blue cards up.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .getPlayerAll()
        .filter(other => other !== player)
        .flatMap(other => game.util.colors().map(color => ({ color, splay: game.zones.byPlayer(other, color).splay })))
        .filter(x => game.zones.byPlayer(player, x.color) !== x.splay)
        .map(x => `${x.color} ${x.splay}`)
      const distinct = util.array.distinct(choices).sort()

      const choice = game.actions.choose(player, distinct, { min: 0, max: 1 })[0]
      if (choice) {
        const [color, direction] = choice.split(' ')
        game.aSplay(player, color, direction)
      }
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['blue'], 'up')
    },
  ],
  echoImpl: [],
}
