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
    `You may return exactly two cards of different value from your score pile. If you do, draw and tuck three {6}.`,
    `If you have at least five {h} visible on your board in one color, claim the Heritage achievement.`
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
        const scoreCards = game.cards.byPlayer(player, 'score')
        const cards = game.actions.chooseCards(player, scoreCards, {
          title: 'Choose two cards of different ages to return.',
          min: 0,
          guard: (cards) => {
            // Action is optional
            if (cards.length === 0) {
              return true
            }
            const twoCardsCondition = cards.length === 2
            const differentAgesCondition = cards[0].getAge() !== cards[1].getAge()
            return twoCardsCondition && differentAgesCondition
          },
        })

        if (cards.length === 2) {
          const returned = game.actions.returnMany(player, cards, {
            ordered: true,  // It never matters what order you return cards of different ages.
          })

          if (returned && returned.length === 2) {
            game.actions.drawAndTuck(player, game.getEffectAge(self, 6))
            game.actions.drawAndTuck(player, game.getEffectAge(self, 6))
            game.actions.drawAndTuck(player, game.getEffectAge(self, 6))
          }
        }
      }
    },

    (game, player) => {
      const hexesPerColor = game
        // Grab each stack
        .zones
        .colorStacks(player)

        // Convert each stack to a count of hexes
        .map(zone => zone.cardlist().map(card => card.checkBiscuitIsVisible('h')).length)


      if (hexesPerColor.some(count => count >= 5) && game.checkAchievementAvailable('Heritage')) {
        game.actions.claimAchievement(player, { name: 'Heritage' })
      }
    }
  ],
  echoImpl: (game, player) => {
    const choices = game.util.lowestCards(game.cards.tops(player))
    game.actions.chooseAndScore(player, choices)
  },
}
