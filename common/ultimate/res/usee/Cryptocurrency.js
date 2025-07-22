const util = require('../../../lib/util.js')

module.exports = {
  name: `Cryptocurrency`,
  color: `green`,
  age: 10,
  expansion: `usee`,
  biscuits: `cffh`,
  dogmaBiscuit: `f`,
  dogma: [
    `Return all cards from your score pile. For each different value of card you return, draw and score a {0}.`,
    `You may splay your red cards up.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const scorePile = game.zones.byPlayer(player, 'score')
      const returned = game.actions.returnMany(player, scorePile.cards())

      const uniqueAges = util.array.distinct(returned.map(card => card.getAge()))
      uniqueAges.forEach(() => {
        game.aDrawAndScore(player, game.getEffectAge(self, 10))
      })
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['red'], 'up')
    }
  ],
}
