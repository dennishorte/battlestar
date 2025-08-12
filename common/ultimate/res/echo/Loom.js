
const util = require('../../../lib/util.js')

module.exports = {
  name: `Loom`,
  color: `red`,
  age: 6,
  expansion: `echo`,
  biscuits: `f6h&`,
  dogmaBiscuit: `f`,
  echo: `Score your lowest top card.`,
  dogma: [
    `You may return two cards of different value from your score pile. If you do, draw and tuck three {6}.`,
    `If you have five or more {h} visible on your board in one color, claim the Heritage achievement.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      // Check if there are at least two values in score pile.
      const ages = game
        .cards.byPlayer(player, 'score')
        .map(card => card.getAge())

      if (util.array.distinct(ages).length <= 1) {
        game.log.add({
          template: '{player} has fewer than two different ages in score pile',
          args: { player }
        })
      }

      else {
        const card1 = game.actions.chooseCard(player, game.cards.byPlayer(player, 'score'), { title: 'Choose a first card to return', min: 0, max: 1 })

        if (card1) {
          const choices = game
            .cards.byPlayer(player, 'score')
            .filter(card => card.getAge() !== card1.getAge())
          const card2 = game.actions.chooseCard(player, choices, { title: 'Choose a second card to return' })

          const returned = game.actions.returnMany(player, [card1, card2], { ordered: true })

          if (returned && returned.length === 2) {
            game.actions.drawAndTuck(player, game.getEffectAge(self, 6))
            game.actions.drawAndTuck(player, game.getEffectAge(self, 6))
            game.actions.drawAndTuck(player, game.getEffectAge(self, 6))
          }
        }
      }
    },

    (game, player) => {
      const hexes = game
        // Grab each stack
        .util.colors()
        .map(color => game.zones.byPlayer(player, color))

        // Convert each stack to a count of hexes
        .map(zone => zone
          .cardlist()
          .map(c => (game.getBiscuitsRaw(c, zone.splay).match(/h/g) || []).length )
          .reduce((prev, curr) => prev + curr, 0)
        )

      if (hexes.some(count => count >= 5) && game.checkAchievementAvailable('Heritage')) {
        game.actions.claimAchievement(player, { name: 'Heritage' })
      }
    }
  ],
  echoImpl: (game, player) => {
    const choices = game.util.lowestCards(game.cards.tops(player))
    game.actions.chooseAndScore(player, choices)
  },
}
