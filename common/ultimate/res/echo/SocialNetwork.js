const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Social Network`,
  color: `red`,
  age: 10,
  expansion: `echo`,
  biscuits: `haii`,
  dogmaBiscuit: `i`,
  echo: [],
  dogma: [
    `I demand you choose an icon type! Transfer all top cards without that icon from your board to my score pile!`,
    `If you have fewer {f}, fewer {c}, and fewer {k} than each other player, you win.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const biscuit = game.actions.choose(player, ['{k}', '{c}', '{s}', '{l}', '{f}', '{i}'], {
        title: 'Choose a biscuit',
      })[0][1]
      const toTransfer = game
        .cards
        .tops(player)
        .filter(card => !card.checkHasBiscuit(biscuit))
      game.actions.transferMany(player, toTransfer, game.zones.byPlayer(leader, 'score'))
    },

    (game, player) => {
      const mine = game.getBiscuitsByPlayer(player)
      const theirs = game
        .getPlayerAll()
        .filter(other => other !== player)
        .map(other => game.getBiscuitsByPlayer(other))

      for (const biscuits of theirs) {
        if (mine.f >= biscuits.f || mine.c >= biscuits.c || mine.k >= biscuits.k) {
          game.log.addNoEffect()
          return
        }
      }

      throw new GameOverEvent({
        player,
        reason: this.name
      })
    }
  ],
}
