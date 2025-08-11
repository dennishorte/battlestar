
const util = require('../../../lib/util.js')

module.exports = {
  name: `MP3`,
  color: `yellow`,
  age: 10,
  expansion: `echo`,
  biscuits: `cahc`,
  dogmaBiscuit: `c`,
  echo: ``,
  dogma: [
    `Return any number of cards from your hand. For each card returned, claim two standard achievements for which you are eligible.`,
    `Draw and score a card of value equal to a bonus on your board.`
  ],
  dogmaImpl: [
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
            game.mLog({ template: 'No eligible achievements' })
            break
          }
        }
      }
    },

    (game, player) => {
      const choices = util.array.distinct(game.getBonuses(player)).sort()
      const age = game.actions.chooseAge(player, choices, { title: 'Choose an age to draw and score' })
      if (age) {
        game.actions.drawAndScore(player, age)
      }
    }
  ],
  echoImpl: [],
}
