const util = require('../../../lib/util.js')

module.exports = {
  name: `MP3`,
  color: `yellow`,
  age: 10,
  expansion: `echo`,
  biscuits: `pa&h`,
  dogmaBiscuit: `p`,
  echo: [`Draw and score a {0}`],
  dogma: [
    `Draw and score a card of value equal to a bonus on your board, if there is one.`,
    `Return any number of cards from your hand. For each card returned, claim two available standard achievements for which you are eligible.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = util.array.distinct(game.getBonuses(player)).sort()
      const age = game.actions.chooseAge(player, choices, { title: 'Choose an age to draw and score' })
      if (age) {
        game.actions.drawAndScore(player, age)
      }
    },

    (game, player) => {
      const returned = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'), { min: 0, max: 999 })

      if (returned) {
        const toAchieve = returned.length * 2
        for (let i = 0; i < toAchieve; i++) {
          const choices = game.getEligibleAchievementsRaw(player)
          if (choices) {
            game.actions.chooseAndAchieve(player, choices)
          }
          else {
            game.log.add({ template: 'No eligible achievements' })
            break
          }
        }
      }
    },
  ],
  echoImpl: [
    (game, player, { self }) => {
      game.actions.drawAndScore(player, game.getEffectAge(self, 10))
    }
  ],
}
