
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
    (game, player) => {
      // Check if there are at least two values in score pile.
      const ages = game
        .getCardsByZone(player, 'score')
        .map(card => card.getAge())

      if (util.array.distinct(ages).length <= 1) {
        game.mLog({
          template: '{player} has fewer than two different ages in score pile',
          args: { player }
        })
      }

      else {
        const card1 = game.aChooseCard(player, game.getCardsByZone(player, 'score'), { title: 'Choose a first card to return', min: 0, max: 1 })

        if (card1) {
          const choices = game
            .getCardsByZone(player, 'score')
            .filter(card => card.getAge() !== card1.getAge())
          const card2 = game.aChooseCard(player, choices, { title: 'Choose a second card to return' })

          const returned = game.aReturnMany(player, [card1, card2], { ordered: true })

          if (returned && returned.length === 2) {
            game.aDrawAndTuck(player, game.getEffectAge(this, 6))
            game.aDrawAndTuck(player, game.getEffectAge(this, 6))
            game.aDrawAndTuck(player, game.getEffectAge(this, 6))
          }
        }
      }
    },

    (game, player) => {
      const hexes = game
        // Grab each stack
        .utilColors()
        .map(color => game.getZoneByPlayer(player, color))

        // Convert each stack to a count of hexes
        .map(zone => zone
          .cards()
          .map(c => (game.getBiscuitsRaw(c, zone.splay).match(/h/g) || []).length )
          .reduce((prev, curr) => prev + curr, 0)
        )

      if (hexes.some(count => count >= 5) && game.checkAchievementAvailable('Heritage')) {
        game.aClaimAchievement(player, { name: 'Heritage' })
      }
    }
  ],
  echoImpl: (game, player) => {
    const choices = game.utilLowestCards(game.getTopCards(player))
    game.aChooseAndScore(player, choices)
  },
}
