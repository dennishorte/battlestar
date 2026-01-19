import util from '../../../lib/util.js'

export default {
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
      const returned = game.actions.returnMany(player, scorePile.cardlist())

      const uniqueAges = util.array.distinct(returned.map(card => card.getAge()))
      uniqueAges.forEach(() => {
        game.actions.drawAndScore(player, game.getEffectAge(self, 10))
      })
    },
    (game, player) => {
      game.actions.chooseAndSplay(player, ['red'], 'up')
    }
  ],
}
