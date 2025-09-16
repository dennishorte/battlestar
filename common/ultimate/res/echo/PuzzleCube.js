const util = require('../../../lib/util.js')

module.exports = {
  name: `Puzzle Cube`,
  color: `purple`,
  age: 10,
  expansion: `echo`,
  biscuits: `&chc`,
  dogmaBiscuit: `c`,
  echo: `Meld a card from your score pile.`,
  dogma: [
    `You may score the bottom card or two bottom cards of one color from your board. If all the colors on your board contain the same number of visible cards, you win.`,
    `Draw and meld a {0}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const color = game.actions.choose(player, game.util.colors(), {
        title: 'Choose a color for scoring bottom cards',
        min: 0,
        max: 1
      })

      if (!color || color.length === 0) {
        game.log.addDoNothing(player)
        return
      }

      const count = game.actions.choose(player, [1, 2], { title: `Score your bottom 1 or 2 ${color} cards?` })

      for (let i = 0; i < count; i++) {
        const card = game.getBottomCard(player, color)
        if (card) {
          game.actions.score(player, card)
        }
      }

      const visibleCounts = game
        .util.colors()
        .map(color => {
          const zone = game.zones.byPlayer(player, color)
          const cards = zone.cardlist()
          if (zone.splay === 'none') {
            return cards.length > 0 ? 1 : 0
          }
          else {
            return cards.length
          }
        })
        .filter(count => count > 0)

      const distinctCounts = util.array.distinct(visibleCounts).length
      if (distinctCounts === 1) {
        game.youWin(player, self.name)
      }
    },

    (game, player, { self }) => {
      game.actions.drawAndMeld(player, game.getEffectAge(self, 10))
    },
  ],
  echoImpl: [
    (game, player) => {
      game.actions.chooseAndMeld(player, game.cards.byPlayer(player, 'score'))
    }
  ],
}
