const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Social Networking`,
  color: `red`,
  age: 10,
  expansion: `echo`,
  biscuits: `hap&`,
  dogmaBiscuit: `p`,
  echo: [`Score a top non-red card from your board.`],
  dogma: [
    `I demand you choose a standard biscuit type! Transfer all top cards without that biscuit from your board to my score pile!`,
    `If you have fewer {f}, fewer {c}, and fewer {k} than each opponent, you win.`
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

    (game, player, { self }) => {
      const mine = game.getBiscuitsByPlayer(player)
      const theirs = game
        .players
        .other(player)
        .map(other => game.getBiscuitsByPlayer(other))

      for (const biscuits of theirs) {
        if (mine.f >= biscuits.f || mine.c >= biscuits.c || mine.k >= biscuits.k) {
          game.log.addNoEffect()
          return
        }
      }

      throw new GameOverEvent({
        player,
        reason: self.name
      })
    }
  ],
  echoImpl: [
    (game, player) => {
      const options = game
        .cards
        .tops(player)
        .filter(card => card.color !== 'red')
      game.actions.chooseAndScore(player, options)
    }
  ],
}
