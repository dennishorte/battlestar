
const util = require('../../../lib/util.js')

module.exports = {
  name: `ATM`,
  color: `yellow`,
  age: 9,
  expansion: `echo`,
  biscuits: `ch&9`,
  dogmaBiscuit: `c`,
  echo: `Draw and score a card of any value.`,
  dogma: [
    `I demand you transfer the highest top non-yellow card without a {c} from your board to my board!`,
    `You may splay your purple cards up.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const topCoins = game
        .cards.tops(player)
        .filter(card => card.color !== 'yellow')
        .filter(card => !card.checkHasBiscuit('c'))
        .sort((l, r) => r.getAge() - l.getAge())

      // In case there are no valid options.
      if (topCoins.length === 0) {
        game.mLog({ template: 'No valid cards' })
        return
      }

      const highest = util
        .array
        .takeWhile(topCoins, card => card.getAge() === topCoins[0].getAge())

      const card = game.aChooseCard(player, highest)
      if (card) {
        game.actions.transfer(player, card, game.zones.byPlayer(leader, card.color))
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['purple'], 'up')
    }
  ],
  echoImpl: (game, player) => {
    const age = game.aChooseAge(player)
    game.actions.drawAndScore(player, age)
  },
}
